function bestCharge(selectedItems) {
  let splitters = ['============= 订餐明细 =============\n','-----------------------------------\n','==================================='];
  // 打印表头
  let summary = splitters[0];
  // 打印清单
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let superSelectedItems = getSuperItemList(getItemList(selectedItems),allItems);
  for(let i = 0, len = superSelectedItems.length; i < len; i++)
    summary += superSelectedItems[i][2]+' x '+ superSelectedItems[i][1] + ' = '+ superSelectedItems[i][1]*superSelectedItems[i][3]+'元\n';
  summary += splitters[1];
  // 打印折扣信息
  let sum = getNoDiscountPrice(superSelectedItems);
  let discount1 = getDiscount1(sum);
  let discount2 = getDiscount2(superSelectedItems, promotions[1].items);
  let discount = 0;
  if(discount2 > discount1)
  {
    // 方案2
    discount = discount2;
    let discountinfo ='使用优惠:\n' + promotions[1].type;
    // 打印半价菜品名称
    discountinfo += '(';
    let discountItem = promotions[1].items;
    for(let i = 0, len1 = discountItem.length; i < len1; i++)
      for(let j = 0, len2 = allItems.length; j < len2; j++)
      if(discountItem[i] === allItems[j].id)
      {
        discountinfo += allItems[j].name;
        if(i !== len1 - 1) discountinfo += '，';
        break;
      }
    discountinfo += ')'; 
    summary += discountinfo + '，省'+ discount +'元\n' + splitters[1];
  }
  else if(discount1 === 6)
  {
    discount = discount1;
    let discountinfo ='使用优惠:\n' + promotions[0].type;
    summary += discountinfo + '，省'+ discount +'元\n' + splitters[1];
  }
  // 打印总计付款
  summary += '总计：'+ (sum - discount) +'元\n' + splitters[2];
  return summary;
}

function getItemList(inputs){
  let result = [];
  for(let i = 0, len = inputs.length; i < len; i++)
  {
    let item = inputs[i].split(" x ");
    result.push([item[0], parseFloat(item[1])]);
  }
  return result;
}

function getSuperItemList(ItemList, allItems){
  for(let i = 0, len1 = ItemList.length; i < len1; i++)
    for(let j = 0, len2 = allItems.length; j < len2; j++)
      if(ItemList[i][0] === allItems[j].id)
      {
        ItemList[i]= ItemList[i].concat([allItems[j].name, allItems[j].price]);
        break;
      }
  return ItemList;
}

function getNoDiscountPrice(superItemList){
  let sum = 0;
  for(let i = 0, len = superItemList.length; i < len; i++)
    sum += superItemList[i][1] * superItemList[i][3];
  return sum;
}

function getDiscount1(money){
  return money >= 30 ? 6 : 0;
}

function getDiscount2(superItemList, promotItems){
  let result = 0;
  for(let i = 0, len1 = superItemList.length; i < len1; i++)
    for(let j = 0, len2 = promotItems.length; j < len2; j++)
  if(superItemList[i][0] === promotItems[j])
  {
    result += superItemList[i][1] * superItemList[i][3] * 0.5;
    break;
  }
  return result;
}