import { AddressInput } from '@shared/ui';
import { CutleryCounter } from '../CutleryCounter';

export const AddressSection = ({ visible, address, setAddress, cutleryCount, setCutleryCount }) => {
  if (!visible) return null;
  return (
    <>
      <AddressInput setAddress={setAddress} />
      <CutleryCounter count={cutleryCount} setCount={setCutleryCount} />
    </>
  );
};


