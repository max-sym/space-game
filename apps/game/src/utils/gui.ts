import { B, GUI } from '~/b';

// Create an advanced texture for fullscreen UI
const advancedTexture =
  GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    'UI'
  );

// Create a text block to display stone generation message
const stoneMessage = new GUI.TextBlock();
stoneMessage.text = ''; // Initial text
stoneMessage.color = 'white';
stoneMessage.fontSize = 20;
stoneMessage.textHorizontalAlignment =
  GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
stoneMessage.textVerticalAlignment =
  GUI.Control.VERTICAL_ALIGNMENT_TOP;
stoneMessage.paddingTop = '10px';
advancedTexture.addControl(stoneMessage);

// Subscribe to the stoneGenerated event
document.addEventListener(
  'stoneGenerated',
  () => {
    // Update the text block with the stone generation message
    stoneMessage.text = '+10 stone produced'; // Update with the appropriate message
    // Reset the message after a certain duration (optional)
    setTimeout(() => {
      stoneMessage.text = '';
    }, 5000); // 5000 milliseconds (5 seconds) for example
  }
);
