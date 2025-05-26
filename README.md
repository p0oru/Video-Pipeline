```markdown
# Video Processing Pipeline API

This project provides a Node.js Express server with an endpoint to upload a video, process it through a series of enhancement agents, and then make the processed video available for download.

## Description

The server accepts a video file via a POST request. This video is then sequentially processed by four agents:

1.  **Audio Enhancer**: Modifies the audio track of the video.
2.  **Brightness Fix**: Adjusts the brightness of the video.
3.  **Subtitle Adder**: Adds subtitles to the video.
4.  **Noise Remover**: Cleans up noise from the video.

After all processing steps are complete, the modified video is sent back to the client for download.

## Prerequisites

Before you begin, ensure you have the following installed:

* Node.js
* npm (Node Package Manager)

## Project Structure

Ensure your project has the following structure, especially the `agents` directory containing the implementations for each processing step:

```
project-root/
├── agents/
│   ├── agent1_audioEnhancer.js
│   ├── agent2_brightnessFix.js
│   ├── agent3_subtitleAdder.js
│   └── agent4_noiseRemover.js
├── uploads/  (This directory will be created by multer to store temporary files)
├── index.js
└── package.json (You'll generate this)
```

**Note:** The `index.js` file assumes that `agent1_audioEnhancer.js`, `agent2_brightnessFix.js`, `agent3_subtitleAdder.js`, and `agent4_noiseRemover.js` are present in an `./agents/` directory relative to `index.js`. These agent files should export asynchronous functions that take a file path as input and return a new file path (or the same one if modified in place).

## Installation

1.  **Clone the repository (or set up your project):**
    If you have a repository:
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
    If you only have `index.js`, create a new project directory, place the file inside, and create the `agents` subdirectory with the respective agent files.

2.  **Install dependencies:**
    Open your terminal in the project directory and run:
    ```bash
    npm install express multer
    ```
    This will also create a `package.json` and `package-lock.json` if they don't exist.

## Configuration

No external `.env` file or specific environment variables are required for this server as per the provided `index.js`. The configuration for `multer` (upload destination) is handled within the script.

## Running the Server

To start the server, run the following command in your terminal from the project root:

```bash
node index.js
```

The server will start and listen on `http://localhost:3000`. You should see the message: `Server running on port 3000`.

## API Endpoints

### Upload and Process Video

* **URL:** `/upload`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Form Data:**
    * `video`: The video file to upload and process.
* **Description:**
    This endpoint accepts a single video file. The file is saved temporarily to the `./uploads/` directory. It is then passed sequentially through `audioEnhancer`, `brightnessFix`, `subtitleAdder`, and `noiseRemover`. Each agent function receives the file path of the video from the previous step (or the original path for the first agent) and is expected to return the file path of the processed video. After all agents have processed the video, the final version is sent back to the client as a downloadable file.
* **Success Response:**
    * **Code:** `200 OK`
    * **Content:** The processed video file is sent for download.
* **Error Response:**
    * **Code:** `500 Internal Server Error`
    * **Content:** `"Error processing video"` if any of the agent functions throw an error or if there's an issue during file handling. The console will log the specific error.

## How to Use (Example with cURL)

To upload and process a video named `myvideo.mp4` located in your current directory:

```bash
curl -X POST -F "video=@myvideo.mp4" http://localhost:3000/upload --output processed_video.mp4
```

This command will:
1.  Send `myvideo.mp4` to the `/upload` endpoint.
2.  The server will process it.
3.  The processed video will be downloaded and saved as `processed_video.mp4` in your current directory.

## Code Overview

* **`express`**: Web framework for Node.js used to create the server and the `/upload` route.
* **`multer`**: Middleware for handling `multipart/form-data`, which is used for uploading files.
    * Files are temporarily stored in the `./uploads/` directory.
    * Filenames are generated using `Date.now() + '-' + file.originalname` to ensure uniqueness.
* **`path`**: (Implicitly used by `multer` or could be used in agents, though not directly in the provided `index.js` for main logic). Standard Node.js module for handling and transforming file paths.
* **Agent Modules (`./agents/agent*.js`)**: These are custom modules responsible for the actual video processing tasks. Each agent is an asynchronous function that takes a file path and returns a (potentially new) file path.
    * `audioEnhancer`
    * `brightnessFix`
    * `subtitleAdder`
    * `noiseRemover`
* **Processing Pipeline**: The core logic in the `/upload` route sequentially calls each agent, passing the output file path of one agent as the input to the next.
* **Error Handling**: A try-catch block is used to handle errors during the processing pipeline. If an error occurs, a `500` status is sent, and the error is logged to the console.

## Dependencies

* `express`: (Version depends on your `npm install` command, e.g., ^4.17.1)
* `multer`: (Version depends on your `npm install` command, e.g., ^1.4.5-lts.1)

To see the exact installed versions, you can check your `package.json` or run `npm list`.

## Important Considerations & Future Enhancements

* **Agent Implementations**: The provided `index.js` *defines the flow* but relies on external agent modules (`./agents/*.js`). These modules must be implemented correctly for the video processing to work. They should handle file I/O and the specific media transformations.
* **Error Handling in Agents**: Each agent should have robust error handling. The current `index.js` will catch errors thrown by agents, but more specific error messages could be propagated to the client.
* **File Management**: The `uploads/` directory will accumulate files. Implement a cleanup strategy for these temporary files (original and intermediate processed files if agents create new ones at each step).
* **Resource Intensive Operations**: Video processing is resource-intensive. For a production environment, consider:
    * Job queues (e.g., BullMQ, RabbitMQ) to handle long-running processing tasks in the background.
    * Streaming for uploads and downloads if possible.
    * More detailed progress reporting to the client for long operations.
* **Scalability**: For handling multiple concurrent requests, you might need to scale the application (e.g., using PM2 or deploying to a platform with auto-scaling).
* **Configuration for Agents**: Agents might require their own configurations (e.g., API keys for a subtitle service, intensity of brightness fix). This could be managed via environment variables or configuration files.
* **Input Validation**: Add validation for file types, sizes, etc., before starting the processing.

```
