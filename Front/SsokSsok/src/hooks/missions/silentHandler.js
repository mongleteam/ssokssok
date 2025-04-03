export const silentHandler = ({ micVolume, onSuccess, utils }) => {
    if (utils.checkSilent(micVolume)) {
      console.log("🤫 조용함 인식됨!");
      onSuccess();
    }
  };
  