export function createParameterPanel() {
    const parameterPanel = document.createElement('div');
    parameterPanel.id = 'parameterPanel';
    parameterPanel.style.display = 'none';
  
    const parameterDisplay = document.createElement('pre');
    parameterDisplay.id = 'parameterDisplay';
  
    parameterPanel.appendChild(parameterDisplay);
  
    return parameterPanel;
  }
  