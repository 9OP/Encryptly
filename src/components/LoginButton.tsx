import { useCallback } from 'react';
import { GoogleIcon } from '@app/components/Icons';
import { revokeApp } from '@app/hooks/http';
import { verifyScopes } from '@app/lib/authorizationUrl';
import { Button } from '@chakra-ui/react';

interface props {
  url: string;
  onSuccess: (accessToken: string) => void;
  onFailure: (err: string) => void;
}

const LoginButton = ({ url, onSuccess, onFailure }: props) => {
  const openConsentScreen = useCallback(() => {
    const width = 400;
    const height = 600;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    return window.open(
      url,
      '',
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left,
    );
  }, [url]);

  const polling = useCallback(
    (popup: Window) => {
      const polling = setInterval(async () => {
        if (!popup || popup.closed || popup.closed === undefined) {
          clearInterval(polling);
          onFailure('Popup has been closed by user');
        }

        const closeDialog = () => {
          clearInterval(polling);
          popup.close();
        };

        try {
          if (!popup.location.hostname.includes('google.com')) {
            if (popup.location.hash) {
              // redirectUri/#access_token=....
              const hash = popup.location.hash.split('#')[1];
              const parsedHash = new URLSearchParams(hash);
              const accessToken = parsedHash.get('access_token');
              const scopes = parsedHash.get('scope');

              closeDialog();

              if (!accessToken) {
                return onFailure('Access token not found');
              }

              if (!verifyScopes(scopes?.split(' ') || [])) {
                await revokeApp(accessToken);
                return onFailure('Missing application scopes');
              }

              return onSuccess(accessToken);
            }
          }
        } catch (err) {
          // The popup window has domain "google.com", browser prevent
          // javascript running on localhost to access the location.hostname of the popup
          // It raises `DOMException: Blocked a frame with origin from accessing a cross-origin frame.`
          //
          // As long as the popup window is the google oauth consent screen page, the polling is failing.
          // Once the user accept the consent screen, the popup windows redirect to "http://localhost:3000"
          // with a code in query parameter. This code is necessay to request the access token for the user.
          //
          // console.error(err);
        }
      }, 250);
    },
    [onFailure, onSuccess],
  );

  const handleClick = useCallback(() => {
    const window = openConsentScreen();
    if (window) {
      polling(window);
    }
  }, [openConsentScreen, polling]);

  return (
    <Button
      width="100%"
      height="4rem"
      fontSize="lg"
      leftIcon={
        <GoogleIcon
          boxSize="2rem"
          backgroundColor="white"
          borderRadius="25px"
          padding="0.1rem"
        />
      }
      onClick={handleClick}
      backgroundColor="white"
      _active={{
        backgroundColor: '#4285F4',
        color: 'white',
      }}
    >
      Sign in with Google
    </Button>
  );
};

export default LoginButton;
