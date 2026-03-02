const orderNameMaker = (productId) => {
  let orderName;
  switch (productId) {
    case process.env.COSMOS_PRODUCT_VOUCHER_1:
      orderName = "I";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_2:
      orderName = "II";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_3:
      orderName = "III";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_4:
      orderName = "IV";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_5:
      orderName = "V";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_6:
      orderName = "VI";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_7:
      orderName = "VII";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_8:
      orderName = "VIII";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_9:
      orderName = "IX";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_10:
      orderName = "X";
      break;
    case process.env.COSMOS_PRODUCT_VOUCHER_11:
      orderName = "XI";
      break;
    case process.env.COSMOS_PRODUCT_ADS_REMOVER:
      orderName = "Normal Tarot 3-Day Free Pass";
      break;
    case process.env.COSMOS_PRODUCT_EVENT_PACKAGE:
      orderName = "August Limited Mega Thank You Pack";
      break;
    case process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE:
      orderName = "Beginner Package";
      break;
    case process.env.COSMOS_PRODUCT_PACKAGE_1:
      orderName = "Voucher I Package";
      break;
    case process.env.COSMOS_PRODUCT_PACKAGE_2:
      orderName = "Voucher II Package";
      break;
    case process.env.COSMOS_PRODUCT_PACKAGE_3:
      orderName = "Voucher III Package";
      break;
    case process.env.COSMOS_PRODUCT_PACKAGE_4:
      orderName = "Voucher IV Package";
      break;
    case process.env.COSMOS_PRODUCT_PACKAGE_5:
      orderName = "Voucher V Package";
      break;
    case process.env.COSMOS_PRODUCT_PACKAGE_6:
      orderName = "Voucher VI Package";
      break;
    case process.env.COSMOS_PRODUCT_PACKAGE_10:
      orderName = "Voucher X Package";
      break;
    case process.env.VITE_COSMOS_STAR_50:
      orderName = "Stars 50 Package";
      break;
    default:
      orderName = "Unknown";
  }
  return orderName;
};

module.exports = orderNameMaker;
