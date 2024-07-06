export const getAmmount = async ({ marketData = {}, account = {}, percentage = 0 }) => {
  try {
    const targetedMarket = account.percentage.find((p) => p.itemName === marketData.marketName);
    console.log(targetedMarket);
    if (!targetedMarket) return 0;
    const ammount = targetedMarket[`${percentage}%`];
    if (!ammount || !ammount > 0) return 0;
    return ammount;
  }
  catch (err) {
    console.log(err);
  }
};


export const calAmountbyU = (account, stopLoss, entryPrice, side) => {
  if (!stopLoss || !entryPrice || !account || stopLoss === entryPrice) return 0;

  let amount;

  if (side === 'buy') {
    amount = account / (entryPrice - stopLoss);
  } else if (side === 'sell') {
    amount = account / (stopLoss - entryPrice);
  } else {
    return 0;
  }

  if (Number.isInteger(amount)) {
    return amount;
  } else {
    return parseFloat(amount.toFixed(2));
  }
}




export const genLog = async (status = '', message = '') => {
  if (!status || !message) return {};
  const log = { time: new Date().toISOString(), status, message };
  return log;
};

export const calcAmmount = async (ammount, percentage) => {
  if (!ammount || !percentage) return 0;
  return Math.ceil((percentage / 100) * ammount);
};
