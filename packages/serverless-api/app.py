from chalice import Chalice
from chalice import CORSConfig
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

app = Chalice(app_name='serverless-api')

# TODO: update with prod url + isdev condition
cors_config = CORSConfig(
    allow_origin='http://localhost:3000',
    allow_headers=['X-Special-Header'],
    max_age=600,
    allow_credentials=True
)


@app.route('/', cors=cors_config)
def index():
    return {'hello': 'world'}


@app.route('/get_transcript', cors=cors_config)
def get_transcript():
    video_id = app.current_request.query_params.get('videoId')
    if video_id:
        try:
            # Fetching the transcript for the given video ID
            transcript = YouTubeTranscriptApi.get_transcript(
                            video_id,
                            languages=['es', 'it', 'pt', 'ru', 'fr', 'en']
                        )
            txt_formatter = TextFormatter()
            text = txt_formatter.format_transcript(transcript)
            return text
        except Exception as e:
            return str(e)
    else:
        return "Video ID is required"


# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
