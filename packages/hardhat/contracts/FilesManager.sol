// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract FilesManager {
	// Mapping to store the file info
	mapping(uint256 fileId => FileInfo) public filesInfoMap;

	struct FileInfo {
		uint256 fileId;
		string transcriptCid;
		string analysisCid;
	}

	// Event to emit when a file is added
	event FileCreated(FileInfo file);

	error ExistentFile(address fileOwner, uint256 fileId);
	error FileDoesNotExist(uint256 fileId);

	/**
	 * @dev internal function to upload file information
	 *            (do no file related checks before calling it)
	 * @param _fileId The file ID.
	 * @param _transcriptCid The transcript reference.
	 * @param _analysisCid The analysis reference.
	 * emits FileCreated event.
	 */
	function _createFile(
		uint256 _fileId,
		string memory _transcriptCid,
		string memory _analysisCid
	) internal {
		if (filesInfoMap[_fileId].fileId != 0)
			revert ExistentFile(msg.sender, _fileId);

		FileInfo memory _newFile = FileInfo({
			fileId: _fileId,
			transcriptCid: _transcriptCid,
			analysisCid: _analysisCid
		});
		filesInfoMap[_fileId] = _newFile;

		emit FileCreated(_newFile);
		// todo add logic to store the info in TableLand
	}

	/**
	 * @dev Internal function to access file information.
	 *    (do no file related checks before calling it)
	 * @param _fileId The file ID.
	 * @return retFileInfo The file information.
	 * emits FileInfoAccessed event.
	 */
	function _getFile(
		uint256 _fileId
	) internal view returns (FileInfo memory retFileInfo) {
		retFileInfo = filesInfoMap[_fileId];
		if (retFileInfo.fileId == 0) revert FileDoesNotExist(_fileId);
	}
}