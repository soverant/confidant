import React from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

interface Item {
  prompt: string;
  spec: string;
  response: string;
}

interface HorizontalScrollButtonsProps {
  items: Item[];
}

const ScrollContainer = styled(Box)({
  display: 'flex',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  padding: '16px',
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
});

export const HorizontalScrollButtons: React.FC<HorizontalScrollButtonsProps> = ({ items }) => {
  return (
    <ScrollContainer>
      {items.map((item, index) => (
        <Button
          key={index}
          variant="contained"
          style={{ marginRight: '8px' }}
          onClick={() => alert(item.response)}
        >
          {item.prompt}
        </Button>
      ))}
    </ScrollContainer>
  );
};
