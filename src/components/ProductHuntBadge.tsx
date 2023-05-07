import { FC } from 'react';
import { Box } from '@chakra-ui/react';

const ProductHuntBadge: FC = () => {
  return (
    <Box position="absolute" zIndex={10} top="6rem">
      <a
        href="https://www.producthunt.com/posts/encryptly?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-encryptly"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=392217&theme=neutral"
          alt="Encryptly | Product Hunt"
          width="280"
          //   height="54"
        />
      </a>
    </Box>
  );
};

export default ProductHuntBadge;
