import React from 'react';
import Switch from 'react-switch';
import { PRIMARY_DARKER, PRIMARY_LIGHTER } from 'etc/colors';

const ToggleSwitch: React.FunctionComponent<{ id: string; onToggle: CallableFunction}> = ({id, onToggle}) => {

  const [checked, setChecked] = React.useState(false);


  const handleChange = React.useCallback(() => {
    setChecked(state => !state);
  }, [
    setChecked
  ]);

  React.useEffect(() => {
    onToggle(checked);
  }, [checked]);

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      onColor={PRIMARY_LIGHTER}
      onHandleColor={PRIMARY_DARKER}
      handleDiameter={12}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      height={10}
      width={24}
      className="react-switch"
      id={id}
    />
  );
};

export default ToggleSwitch;
