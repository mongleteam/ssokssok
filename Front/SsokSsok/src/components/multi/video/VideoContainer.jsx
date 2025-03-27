// VideoContainer.jsx
import SessionManager from './SessionManager';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';

export default function VideoContainer() {
  return (
    <SessionManager>
      <div className="w-full h-full flex flex-col space-y-2">
        <LocalVideo />
        <RemoteVideo />
      </div>
    </SessionManager>
  );
}