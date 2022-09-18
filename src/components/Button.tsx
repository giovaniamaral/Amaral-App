import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';
import React from 'react';

type Props = IButtonProps & {
  title: string;
}

export function Button({ title, ...rest }: Props) {
  return (
    <ButtonNativeBase
      bg="green.200"
      h={14}
      fontSize="sm"
      rounded="sm"
      _pressed={{ bg: "green.100" }}
      {...rest}
    >
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </ButtonNativeBase>
  );
}