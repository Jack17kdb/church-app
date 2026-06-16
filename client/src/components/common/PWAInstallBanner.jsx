import { useState, useEffect } from 'react';
import { FaDownload, FaTimes, FaWifi, FaCross, FaMobileAlt } from 'react-icons/fa';

const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
  );
};

const isIOS = () => {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
};

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Already installed or previously dismissed permanently — don't show
    if (isStandalone() || localStorage.getItem('pwaInstallDismissed') === 'true') {
      return;
    }

    let timer;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      timer = setTimeout(() => setShowModal(true), 12000);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS doesn't support beforeinstallprompt — show modal with manual instructions
    if (isIOS()) {
      timer = setTimeout(() => setShowModal(true), 12000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSInstructions(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowModal(false);
    if (outcome === 'accepted') {
      localStorage.setItem('pwaInstallDismissed', 'true');
    }
  };

  const handleDismiss = (permanent = false) => {
    setShowModal(false);
    setShowIOSInstructions(false);
    if (permanent) {
      localStorage.setItem('pwaInstallDismissed', 'true');
    }
  };

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-gray-800 text-white text-center py-2 text-sm flex items-center justify-center gap-2">
          <FaWifi /> You're offline — showing cached content
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => handleDismiss(false)} />
          <div className="pwa-install-banner relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center">
            <button
              onClick={() => handleDismiss(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-church-600 flex items-center justify-center mx-auto mb-5">
              {showIOSInstructions ? <FaMobileAlt className="text-white text-2xl" /> : <FaCross className="text-white text-2xl" />}
            </div>

            {!showIOSInstructions ? (
              <>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Install Our App</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Add this app to your home screen for quick access to service times, announcements, and giving — even with a weak connection.
                </p>
                <div className="flex flex-col gap-3">
                  <button onClick={handleInstall} className="btn-primary w-full flex items-center justify-center gap-2">
                    <FaDownload /> Install App
                  </button>
                  <button onClick={() => handleDismiss(true)} className="btn-ghost border border-gray-200 w-full text-sm">
                    Maybe later
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Add to Home Screen</h3>
                <p className="text-gray-500 text-sm mb-4 text-left">
                  To install this app on your iPhone or iPad:
                </p>
                <ol className="text-left text-sm text-gray-600 space-y-2 mb-6 list-decimal list-inside">
                  <li>Tap the <strong>Share</strong> button in Safari's toolbar</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right corner</li>
                </ol>
                <button onClick={() => handleDismiss(true)} className="btn-primary w-full">
                  Got it
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallBanner;
