// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
//import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Strings} from "../../../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import {ERC721Holder} from "../../../node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {TablelandDeployments} from "../../../node_modules/@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "../../../node_modules/@tableland/evm/contracts/utils/SQLHelpers.sol";
//import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";

contract FilesManager is ERC721Holder{
    uint256 private _tableId; // Unique table ID
    string private constant _TABLE_PREFIX = "crypto_n_table"; // Custom table prefix

    // Mapping to store FileInfo. Several files from one video.
    mapping(uint256 => mapping(uint256 => FileInfo)) public filesInfoMap;

    struct FileInfo {
        uint256 fileId;
        string transcriptCid;
        string analysisCid;
    }

    // Event to emit when a file is added
    event FileCreated(uint256 id, FileInfo file);

    error ExistentFile(address fileOwner, uint256 fileId);
    error FileDoesNotExist(uint256 fileId);
    error VideoNotExist(uint256 id);


    /**
     * @dev internal function to upload file information
     *            (do no file related checks before calling it)
     * @param _fileId The file ID.
     * @param _transcriptCid The transcript reference.
     * @param _analysisCid The analysis reference.
     * emits FileCreated event.
     */
    function _createFile(
        uint256 _id,
        uint256 _fileId,
        string memory _transcriptCid,
        string memory _analysisCid
    ) internal {
        if (filesInfoMap[_id][_fileId].fileId != 0) revert ExistentFile(msg.sender, _fileId);

        FileInfo memory _newFile = FileInfo({
            fileId: _fileId,
            transcriptCid: _transcriptCid,
            analysisCid: _analysisCid
        });
        filesInfoMap[_id][_fileId] = _newFile;

        this.insertIntoTable(_id, _fileId, _transcriptCid, _analysisCid);

        emit FileCreated(_id, _newFile);
        // todo add logic to store the info in TableLand
    }

    function createAnalysis(string calldata _transcript) internal {
        // todo ask what should this function do
    }

    /**
     * @dev Internal function to access file information.
     *    (do no file related checks before calling it)
     * @param _fileId The file ID.
     * @return retFileInfo The file information.
     * emits FileInfoAccessed event.
     */
    function _getFile(uint256 _id, uint256 _fileId) internal view returns (FileInfo memory retFileInfo) {
        retFileInfo = filesInfoMap[_id][_fileId];
        //if (filesInfoMap[_id] == 0) revert VideoNotExist(_id);
        if (retFileInfo.fileId == 0) revert FileDoesNotExist(_fileId);
    }

    /**
    * @notice Creates a new table with predefined schema
    * @dev The table schema includes an ID, file ID, and CIDs for transcript and analysis
    */
       /**
    * @notice Creates a new table with predefined schema
    * @dev The table schema includes an ID, file ID, and CIDs for transcript and analysis
    */
    function createTable() public payable {
      _tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
              "id integer primary key," // Notice the trailing comma
              "fileId integer,"
              "transcriptCid text,"
              "analysisCid text",

              _TABLE_PREFIX
            )
        );
    }

    /**
    * @notice Inserts a new row into the table
    * @param id The unique identifier for the row
    * @param fileId The ID of the file associated with the row
    * @param transcriptCid The CID for the transcript
    * @param analysisCid The CID for the analysis
    */
    function insertIntoTable(uint256 id, uint256 fileId, string memory transcriptCid, string memory analysisCid) external {
        TablelandDeployments.get().mutate(
            address(this), // Table owner, i.e., this contract
            _tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                _tableId,
                "id,fileId,transcriptCid,analysisCid",
                string.concat(
                    Strings.toString(id), // Convert to a string
                    ",",
                    Strings.toString(fileId), // Convert to a string
                    ",",
                    SQLHelpers.quote(transcriptCid), // Wrap strings in single quotes with the `quote` method
                    ",",
                    SQLHelpers.quote(analysisCid) // Wrap strings in single quotes with the `quote` method
                )
            )
        );
    }


    /**
    * @notice Updates a specific row in the table
    * @param id The unique identifier for the row to update
    * @param fileId The new ID of the file associated with the row
    * @param transcriptCid The new CID for the transcript
    * @param analysisCid The new CID for the analysis
    */
    function updateTable(uint256 id, uint256 fileId, string memory transcriptCid, string memory analysisCid)  external {
        // Set the values to update
        string memory setters = string.concat(
            "fileId=", Strings.toString(fileId),
            ",transcriptCid=", SQLHelpers.quote(transcriptCid),
            ",analysisCid=", SQLHelpers.quote(analysisCid)
        );



        string memory filters = string.concat(
            "id=",
            Strings.toString(id)
        );
        // Mutate a row at 
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toUpdate(_TABLE_PREFIX, _tableId, setters, filters)
        );
    }

    /**
    * @notice Deletes a specific row from the table
    * @param id The unique identifier for the row to delete
    */
    function deleteFromTable(uint256 id) external {
        // Specify filters for which row to delete
        string memory filters = string.concat(
            "id=",
            Strings.toString(id)
        );
        // Mutate a row at `id`
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toDelete(_TABLE_PREFIX, _tableId, filters)
        );
    }

    /**
    * @notice Sets the access control for the table
    * @param controller The address of the controller contract
    */
    function setAccessControl(address controller) external {
        TablelandDeployments.get().setController(
            address(this), // Table owner, i.e., this contract
            _tableId,
            controller // Set the controller address—a separate controller contract
        );
    }

    /**
    * @notice Returns the ID of the table
    * @return The table ID
    */
    function getTableId() external view returns (uint256) {
        return _tableId;
    }


    /**
    * @notice Returns the name of the table
    * @return The table name
    */
    function getTableName() external view returns (string memory) {
        return SQLHelpers.toNameFromId(_TABLE_PREFIX, _tableId);
    }
}