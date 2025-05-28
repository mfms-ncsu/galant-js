import React from "react";

const MainComponent = () => {
  const openPopup = () => {
    const popup = window.open(
      "",
      "PopupWindow",
      "width=400,height=400,resizable,scrollbars"
    );
    if (popup) {
      const options = [
        { name: "Option 1", description: "Description for option 1" },
        { name: "Option 2", description: "Description for option 2" },
        { name: "Option 3", description: "Description for option 3" },
      ];

      const onOptionSelect = (option) => {
        console.log("Selected option:", option);
      };

      const onClose = () => {
        console.log("Popup closed");
      };

      popup.document.write(`
        <div id="popup-root"></div>
        <script>
          window.onbeforeunload = () => {
            window.opener.postMessage("close", "*");
          };
        </script>
      `);

      popup.document.close();
      popup.onload = () => {
        const root = popup.document.getElementById("popup-root");
        const { createRoot } = ReactDOM;
        const rootInstance = createRoot(root);
        rootInstance.render(
          <PopupOptions
            options={options}
            onOptionSelect={onOptionSelect}
            onClose={onClose}
          />
        );
      };
    }
  };

  return (
    <div>
      <button onClick={openPopup}>Open Popup</button>
    </div>
  );
};

export default MainComponent;