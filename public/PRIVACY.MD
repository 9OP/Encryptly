# Privacy Policy:
updated: 4th May 2023

Encryptly is commited to protecting user's privacy. Data collection is minimal and only required for the service to work.

<br />
<br />

- Encryptly **does not** and **will never** collect or share any Google user information including:
    - gmail address / google workspace mail address
    - profile picture
    - name
    - files metadata (date, content type, format, size)
    - files content
    - encryption keys
    - passphrase
  
<br />

- For web analytics purpose Encryptly collect the following information via Clicky (https://clicky.com/):
    - ip address
    - pages views
    - session time
    - number of visits
  
<br />

- Encryptly **does not** and **will never** share or sell analytics information. Analytics data serve the only purpose of improving the service provided by Encryptly.
  
<br />

- Encryptly is open source ["https://github.com/9OP/Encryptly/"] the code should be audited by users to understand and confirm what exact information are accessed and used by Encryptly.

<br />

- Encryptly is a web application. All the application code runs within the user's browser. There are **no** Encryptly servers processing and/or collecting user's information. This means that user information such as mail address, authentication token, name, profile picture, file metadata, are **only saved locally** within the user's browser and the Encryptly application.

<br />

- Encryptly wep application communicates with Goole APIs and Google Drive servers to:
    - Authenticate the user via Oauth2
    - Fetch user google drive file (including content and metadata)
    - Upload file to user google drive (including content and metadata)

<br />

- Encryptly requires the following Google scopes: (https://developers.google.com/identity/protocols/oauth2/scopes?hl=en)
    - `https://www.googleapis.com/auth/drive.file`
      - >See, edit, create, and delete only the specific Google Drive files you use with this app
    - `https://www.googleapis.com/auth/drive.appdata`
      - >See, create, and delete its own configuration data in your Google Drive
    - `https://www.googleapis.com/auth/userinfo.email`
      - >See your primary Google Account email address

<br />

- Encryptly scopes **does allow** to:
    - Create and read application data specific file saved on Google Drive (Encryptly configuration file)
    - Create and read files uploaded via Encryptly
    - Read user mail address

<br />

- Encryptly scopes **does not allow** to:
    - Read and modify user's Google Drive files and metadata **that were not uploaded via Encryptly**
    - Modify user's account information

<br />

- Any data that is encrypted using Encryptly is stored securely in the user's Google Drive account, and Google's privacy policy applies to this data.

<br />
