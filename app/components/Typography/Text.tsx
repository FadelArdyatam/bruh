// File: app/components/typography/Text.tsx
import React, { ReactNode } from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps, StyleProp } from 'react-native';

interface TextProps extends RNTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle> | TextStyle;
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  size?: number;
  center?: boolean;
  margin?: number
}

const Text: React.FC<TextProps> = ({
  children,
  style,
  variant = 'regular',
  color,
  size,
  center,
  ...props
}) => {
  // Font mapping sesuai variant
  const fontFamily = {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  }[variant];
  
  return (
    <RNText
      style={[
        { fontFamily },
        size ? { fontSize: size } : undefined,
        color && { color },
        center && { textAlign: 'center' },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;