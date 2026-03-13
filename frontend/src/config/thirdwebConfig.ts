import { createThirdwebClient } from "thirdweb";


const clientId = "488a81d38f98ebe9c1d230294b669948";

export const client = createThirdwebClient({
  clientId: clientId,
});

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;