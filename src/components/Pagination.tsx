import { ChevronLeftIcon, ChevronRightIcon } from '@app/components/Icons';
import { Button, Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import { FC } from 'react';

interface props {
  range: number;
  selected: number;
  setSelected: (n: number) => void;
}

const Pagination: FC<props> = (props: props) => {
  const { range, selected, setSelected } = props;

  const onNext = () => {
    setSelected(Math.min(selected + 1, range));
  };

  const onPrevious = () => {
    setSelected(Math.max(selected - 1, 1));
  };

  return (
    <Flex
      width="100%"
      justifyContent="flex-end"
      alignItems="center"
      marginTop="1rem"
      color="gray.700"
    >
      <HStack padding="0" margin="0" spacing="0.1rem">
        <IconButton
          aria-label="previous"
          icon={<ChevronLeftIcon boxSize="1.3rem" />}
          onClick={onPrevious}
          size="xs"
          variant="ghost"
          disabled={selected === 1}
        />

        <Button
          onClick={() => setSelected(1)}
          size="xs"
          variant="ghost"
          color={selected === 1 ? 'red.600' : ''}
        >
          1
        </Button>

        {selected >= 1 + 3 && <Text>...</Text>}

        {selected - 1 > 1 && (
          <Button size="xs" onClick={onPrevious} variant="ghost">
            {selected - 1}
          </Button>
        )}

        {selected !== 1 && selected !== range && (
          <Button size="xs" variant="ghost" color="red.600">
            {selected}
          </Button>
        )}

        {selected + 1 < range && (
          <Button size="xs" onClick={onNext} variant="ghost">
            {selected + 1}
          </Button>
        )}

        {selected <= range - 3 && <Text>...</Text>}

        {range !== 1 && (
          <Button
            onClick={() => setSelected(range)}
            size="xs"
            variant="ghost"
            color={selected === range ? 'red.600' : ''}
          >
            {range}
          </Button>
        )}

        <IconButton
          aria-label="next"
          icon={<ChevronRightIcon boxSize="1.3rem" />}
          onClick={onNext}
          size="xs"
          variant="ghost"
          disabled={selected === range}
        />
      </HStack>
    </Flex>
  );
};

export default Pagination;
