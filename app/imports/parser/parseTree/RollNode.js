import ParseNode from '/imports/parser/parseTree/ParseNode.js';
import RollArrayNode from '/imports/parser/parseTree/RollArrayNode.js';
import ErrorNode from '/imports/parser/parseTree/ErrorNode.js';

export default class RollNode extends ParseNode {
  constructor({left, right}) {
		super(...arguments);
    this.left = left;
    this.right = right;
  }
  compile(scope){
    let left = this.left.compile(scope);
    let right = this.right.compile(scope);
    return new RollNode({left, right, previousNodes: [this]});
  }
  toString(){
    if (
      this.left.isNumberNode && this.left.value === 1
    ){
      return `d${this.right.toString()}`;
    } else {
      return `${this.left.toString()}d${this.right.toString()}`;
    }
  }
  roll(scope){
    let left = this.left.reduce(scope);
    let right = this.right.reduce(scope);
    if (!left.isInteger){
      return new ErrorNode({
        node: this,
        error: 'Number of dice is not an integer',
        previousNodes: [this, left, right],
      });
    }
    if (!right.isInteger){
      return new ErrorNode({
        node: this,
        error: 'Dice size is not an integer',
        previousNodes: [this, left, right],
      });
    }
    let number = left.value;
    if (number > 100) return new ErrorNode({
      node: this,
      error: 'Can\'t roll more than 100 dice at once'
    });
    let diceSize = right.value;
    let randomSrc = DDP.randomStream('diceRoller');
    let values = [];
    for (let i = 0; i < number; i++){
      let roll = ~~(randomSrc.fraction() * diceSize) + 1
      values.push(roll);
    }
    return new RollArrayNode({
      values,
      detail: {number, diceSize, values},
      previousNodes: [this, left, right],
    });
  }
  reduce(scope){
    return this.roll(scope).reduce(scope);
  }
}
