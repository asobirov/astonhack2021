import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { SunLight, HalfMoon } from 'iconoir-react';

export const ColorModeSwitcher = (props: any) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(SunLight, HalfMoon);

  return (
    <IconButton
      aria-label={`Switch to ${text} mode`}
      size='lg'
      borderRadius={'2xl'}
      onClick={toggleColorMode}
      icon={<SwitchIcon width="1.25rem" height="1.25rem" />}

      {...props}
    />
  );
};
