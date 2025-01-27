import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';

import { getBalance, getDisplayBalance, getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import useNodeText from '../../../hooks/useNodeText';
import useNodePrice from '../../../hooks/useNodePrice';
import { Bank } from '../../../respect-finance';

interface DepositModalProps extends ModalProps {
  bank: Bank;
  max: BigNumber;
  decimals: number;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({ bank, max, decimals, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('');
  const { getNodeText } = useNodeText();
  const nodePrice = useNodePrice(bank.contract, bank.poolId, bank.sectionInUI);
  const [width, setWidth] = useState(window.innerWidth);
  
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768
  const numNodes = isMobile ? [1, 2, 3] : [1, 2, 3, 4, 5, 6];

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals, false);
  }, [max, decimals]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal>
      <ReactTooltip effect="solid" clickable type="dark" place="bottom" />
      <ModalTitle text={bank.sectionInUI !== 3 ? `Deposit ${tokenName}` : `Purchase ${getNodeText(bank.poolId)}s`} />
      {/* {node && <div style={{ display: 'flex' }}>
        <div style={{ margin: 'auto auto' }}>{' '}</div>
        <div style={{ color: '#bdbdbd', fontSize: '14px', fontWeight: '700' }}>RESETS LOCK TIME</div>
        <div style={{ margin: 'auto auto' }}>{' '}</div>
      </div>
      } */}
      {bank.sectionInUI !== 3 ? <><TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
        <ModalActions>
          {/* <Button color="secondary" variant="outlined" onClick={onDismiss}>Cancel</Button> */}
          <Button className="shinyButtonSecondary" onClick={() => onConfirm(val)}>
            Confirm
          </Button>
        </ModalActions></>
        :
        <div style={{ display: 'flex' }}>
          {numNodes.map((num, i) => {
            return (<>
              <Button data-tip={`${getDisplayBalance(nodePrice.mul(num), 18, 0)} RESPECT`} style={{ whiteSpace: 'nowrap', marginRight: i === numNodes.length - 1 ? '0' : '1rem' }} className="shinyButtonSecondary" onClick={() => onConfirm(num.toString())}>
                {num} {getNodeText(bank.poolId).split(' ')[0]}
              </Button>
            </>
            );
          })}
        </div>
      }
    </Modal>
  );
};

export default DepositModal;
