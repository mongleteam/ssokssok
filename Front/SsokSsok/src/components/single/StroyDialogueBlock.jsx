const StoryDialogueBlock = ({ text }) => {
    if (!text) return null;
  
    return (
      <div className="mt-6 px-6 py-4 rounded-lg max-w-4xl text-center text-4xl font-whitechalk whitespace-pre-line">
        {text}
      </div>
    );
  };
  
  export default StoryDialogueBlock;
  