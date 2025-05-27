# wda-ui

Web UI for WDA/WDI

This is the UI for both WDA and WDI.

UI is build with react.js and Chakra UI.

## code Breakage

Troubleshooting

if `useDisclosure` or `useColorModeValue` :
try restarting the react application, if still facing uninstall node_modules and reinstall `npm ci`s

## Sandbox Integration (Code Server)

### Environment Variable
Add the following to your `.env` file (or set in your environment):

```
REACT_APP_SANDBOX_BASE_URL=http://localhost:4000/api
```

This should point to the base URL of your sandbox backend API.

### API Endpoints Used
- `POST /environments/from-url` — Used to start a new sandbox/code server for a project. The plus (+) icon on each prototype card triggers this endpoint.
- `GET /environments/user/{user_id}` — Used to check for existing running sandboxes for the current user. This is called on page load/refresh to show the arrow icon if a sandbox is already running for that project.

### How It Works
- **Create Sandbox:** Click the plus (+) icon on a prototype card to start a sandbox. This will POST to `/environments/from-url` with the required project and user info.
- **Show Arrow Icon:** On page load, the app checks `/environments/user/{user_id}` for any running sandboxes matching the current project. If found, the arrow icon appears, allowing you to open the code server in a new tab.
- **Regenerate Sandbox:** If you need to restart or regenerate the sandbox, click the plus (+) icon again. If a sandbox is already running, clicking the arrow will open it directly.

### Notes
- The sandbox URL is taken from the `url` field in the environment object returned by the API.
- Make sure your sandbox backend is running and accessible at the URL specified in `REACT_APP_SANDBOX_BASE_URL`.
- If you see network errors, ensure all backend services are up and running.
