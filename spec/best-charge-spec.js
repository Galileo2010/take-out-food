describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  // 字符串拆分测试
  it('test split',()=>{
    let item = "ITEM0013 x 4";
    let result = item.split(" x ");
    expect(result[0]).toEqual("ITEM0013");
    expect(result[1]).toEqual("4");
  });
  // 生成原始菜单1测试
  it('test getItemList1', ()=>{
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let result = getItemList(inputs);
    expect(result).toEqual([["ITEM0013",4],["ITEM0022",1]]);
    inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    result = getItemList(inputs);
    expect(result).toEqual([["ITEM0001",1],["ITEM0013",2],["ITEM0022",1]]);
  });
  // 由原始菜单生成详细清单测试
  it('test getSuperItemList', ()=>{
    let inputs = ["ITEM0013 x 4"];
    let result = getItemList(inputs);
    let allitems = loadAllItems();
    result = getSuperItemList(result,allitems);
    expect(result).toEqual([["ITEM0013",4,'肉夹馍',6.00]]);
  });
  // 由详细清单计算原价
  it('test getNoDiscount', ()=>{
    let superItemList = [["ITEM0013",4,'肉夹馍',6.00],["ITEM0013",2,'肉夹馍',9.00]];
    let money = getNoDiscountPrice(superItemList);
    sum = 4 * 6.00 + 2 * 9.00;
    expect(money).toEqual(sum);
  });
  // 计算方案1的折扣
  it('test getDiscount1', ()=>{
    let money = getDiscount1(30.1);
    expect(money).toEqual(6);
    money = getDiscount1(29.9);
    expect(money).toEqual(0);
  });
 // 计算方案2的折扣
  it('test getDiscount2', ()=>{
    let superItemList = [["ITEM0001",4,'肉夹馍',6.00],["ITEM0022",2,'肉夹馍',9.00]];
    let money = getDiscount2(superItemList,["ITEM0001","ITEM0022"]);
    sum = 4 * 6.00 * 0.5 + 2 * 9.00 * 0.5;
    expect(money).toEqual(sum);
    money = getDiscount2(superItemList,["ITEM0000","ITEM0022"]);
    sum = 2 * 9.00 * 0.5;
    expect(money).toEqual(sum);
    money = getDiscount2(superItemList,["ITEM0000","ITEM0021"]);
    sum = 0;
    expect(money).toEqual(sum);
  });
});