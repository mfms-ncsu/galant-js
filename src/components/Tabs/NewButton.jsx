import React from 'react';
import ReactDOM from 'react-dom/client';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PopupWindow from 'components/Tabs/PopupWindow';

/**
 * Returns component for creating new tabs, including the button and popup.
 * @param addNew - this comes from TabList and is passed along;
 *                 eventually should be handled more directly
 */
export default function NewButton({examples, addNew}) {
  const openPopup = () => {
    const popupWindow = window.open(
      '',
      '_blank',
      'width=400,height=400,scrollbars=yes,resizable=yes'
    );

    if (popupWindow) {
      popupWindow.document.title = 'Popup Window';

      // Render the React component in the new window
      const container = popupWindow.document.createElement('div');
      popupWindow.document.body.appendChild(container);

      ReactDOM.createRoot(container).render(<PopupWindow examples={examples} addNew={addNew} />);
    } else {
      alert('Popup blocked! Please allow popups for this website.');
    }
  }

  return (
    <div>
      <PrimaryButton className="m-1">
        <button onClick={() => openPopup(true)}>Examples</button>
      </PrimaryButton>
    </div>
  );
}
    //           <div className="relative">
    //         <Menu>
    //             <PrimaryButton className="m-1">
    //                 <Menu.Button ref={button} className="flex items-center" data-cy="NewTabButton">
    //                     <PlusIcon className="h-4 me-2 fill-white stroke stroke-white" />
    //                     <span>New Tab</span>
    //                 </Menu.Button>
    //             </PrimaryButton>
                
    //             <Transition
    //                 as={Fragment}
    //                 enter="transition ease-out duration-100"
    //                 enterFrom="transform opacity-0 scale-95"
    //                 enterTo="transform opacity-100 scale-100"
    //                 className="absolute z-20 p-4 w-fit bg-white rounded-xl shadow-lg"
    //             >
    //                 <Menu.Items className="">
    //                     <Menu.Item>
    //                         <button
    //                             className="hover:underline"
    //                             data-cy="BlankTab"
    //                             onClick={() => {
    //                                 try {
    //                                     addTab({ 'name': 'Blank' });
    //                                 } catch (error) {
    //                                     console.error('An error occurred while adding the blank tab. Please try again.', error);
    //                                 }
    //                             }}
    //                         >
    //                             Blank
    //                         </button>
    //                     </Menu.Item>

    //                     <div className="mt-2 flex flex-col items-start">
    //                         <span className="font-bold" data-cy="ExamplesHeader">Examples</span>
    //                         {examples.map(data => (
    //                             <Menu.Item key={data.name}>
    //                                 <button
    //                                     className="text-nowrap hover:underline"
    //                                     onClick={() => {
    //                                         try {
    //                                             addTab(data);
    //                                         } catch (error) {
    //                                             console.error(`Error adding tab for example ${data.name}:`, error);
    //                                         }
    //                                     }}
    //                                 >
    //                                     {data.name}
    //                                 </button>
    //                             </Menu.Item>
    //                         ))}
    //                     </div>
    //                 </Menu.Items>
    //             </Transition>
    //         </Menu>
    //     </div>
    // );
