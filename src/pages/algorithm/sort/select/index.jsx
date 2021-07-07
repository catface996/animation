import {PageContainer} from '@ant-design/pro-layout';
import {Card, Row, Col, Grid, Button} from 'antd';
import React, {Component} from 'react';
import styles from './index.less';
import {StepForwardOutlined, PlayCircleOutlined, PauseCircleOutlined, RedoOutlined} from '@ant-design/icons';


let that;
let auto;
let cur = 0;
const initStep = {
  arr: [],
  currentIndex: 0,
  fixIndex: 0,
  minIndex: -1,
  minValue: -1,
  choose: false,
  change: false,
  swap: false,
};

class Bubble extends Component {
  state = {
    originArr: [],
    process: [],
    currentStep: {
      arr: [],
      currentIndex: 0,
      fixIndex: 0,
      minIndex: -1,
      minValue: -1,
      choose: false,
      change: false,
      swap: false,
    },
    canNext: true,
    canAuto: true,
    canStop: false,
  };


  /**
   * 构造函数
   * @param props
   * @param context
   */
  constructor(props, context) {
    super(props, context);
    that = this;
  }


  /**
   * 组件第一次渲染完成，此时dom节点已经生成，可以在这里调用ajax请求，返回数据setState后组件会重新渲染
   */
  componentDidMount() {
    this.newRound();
  }

  /**
   * 在此处完成组件的卸载和数据的销毁。
   * clear你在组建中所有的setTimeout,setInterval
   * 移除所有组建中的监听 removeEventListener
   */
  componentWillUnmount() {

  }


  newRound() {
    cur = 0;
    const temp = [];
    const sortArr = [];
    for (let x = 0; x < 10; x += 1) {
      const node1 = {};
      const node2 = {};
      const value = Math.floor(Math.random() * 100);
      node1.value = value;
      node1.position = x;
      node2.value = value;
      node2.position = x;
      temp.push(node1);
      sortArr.push(node2);
    }
    const processArr = [];
    let minIndex = 0;
    let processNode = {};
    processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, 0, 0, false, false, false);
    for (let k = 0; k < sortArr.length; k += 1) {
      minIndex = k;
      let l = k;
      for (; l < sortArr.length; l += 1) {
        processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, l, k, true, false, false);
        processArr.push(processNode);
        if (sortArr[l].value < sortArr[minIndex].value) {
          minIndex = l;
          processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, l, k, false, true, false);
          processArr.push(processNode);
        } else {
          processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, l, k, false, false, false);
          processArr.push(processNode);
        }
      }
      // 交换 k位置和minIndex位置,标注要交换的位置
      processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, l, k, false, false, true);
      processArr.push(processNode);
      // 实施交换
      if (minIndex === k) {
        processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, l, k + 1, false, false, false);
        processArr.push(processNode);
      } else {
        processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, l, k + 1, false, false, false);
        const {value} = sortArr[k];
        sortArr[k].value = sortArr[minIndex].value;
        sortArr[minIndex].value = value;
        processNode = this.buildProcessNode(this.copySortArr(sortArr), minIndex, l, k + 1, false, false, false);
        processArr.push(processNode);
      }
    }
    this.setState({
      originArr: temp,
      process: processArr,
      currentStep: initStep,
      canNext: true,
      canAuto: true,
      canStop: false,
    });
  }

  buildProcessNode(arr, minIndex, currentIndex, fixIndex, choose, change, swap) {
    const processNode = {};
    processNode.arr = arr;
    processNode.currentIndex = currentIndex;
    processNode.fixIndex = fixIndex;
    processNode.minIndex = minIndex;
    processNode.choose = choose;
    processNode.change = change;
    processNode.swap = swap;
    processNode.minValue = arr[minIndex].value;
    return processNode;
  }

  copySortArr(sortArr) {
    const targetArr = [];
    for (let k = 0; k < sortArr.length; k += 1) {
      const node = {};
      node.value = sortArr[k].value;
      node.position = sortArr[k].position;
      targetArr.push(node);
    }
    return targetArr;
  }

  nextStep() {
    const tempProcess = that.state.process.slice();
    if (cur >= tempProcess.length) {
      that.stopAll();
    } else {
      const step = tempProcess[cur];
      cur += 1;
      that.setState({
        currentStep: step,
      });
    }
  }


  autoRun() {
    auto = setInterval(that.nextStep, 500);
    that.setState({
      canNext: false,
      canAuto: false,
      canStop: true,
    });
  }

  stopAutoRun() {
    if (auto !== undefined) {
      clearInterval(auto);
      auto = undefined;
    }
    that.setState({
      canNext: true,
      canAuto: true,
      canStop: false,
    });
  }

  stopAll() {
    if (auto !== undefined) {
      clearInterval(auto);
      auto = undefined;
    }
    that.setState({
      canNext: false,
      canAuto: false,
      canStop: false,
    });
  }


  render() {
    const originArr = this.state.originArr.map(item => {
        return <Col key={item.position} className={styles.col} span={1}>{item.value}</Col>;
      }
    );
    const currentStep = this.state.currentStep.arr.map((item, currentIndex) => {
        if (this.state.currentStep.fixIndex > currentIndex) {
          return <Col key={item.position} className={styles.colFix} span={1}>{item.value}</Col>;
        }

        if (this.state.currentStep.choose) {
          if (currentIndex === this.state.currentStep.currentIndex) {
            return <Col key={item.position} className={styles.chooseCol} span={1}>{item.value}</Col>;
          }
        }
        if (this.state.currentStep.change) {
          if (currentIndex === this.state.currentStep.currentIndex) {
            return <Col key={item.position} className={styles.colChange} span={1}>{item.value}</Col>;
          }
        }
        if (this.state.currentStep.swap) {
          if (currentIndex === this.state.currentStep.minIndex) {
            return <Col key={item.position} className={styles.colSwap} span={1}>{item.value}</Col>;
          }
          if (currentIndex === this.state.currentStep.fixIndex) {
            return <Col key={item.position} className={styles.colSwap} span={1}>{item.value}</Col>;
          }
        }
        return <Col key={item.position} className={styles.col} span={1}>{item.value}</Col>;
      }
    );
    return (
      <PageContainer>
        <Card>
          <Row>
            <Col span={2}>
              <Button
                icon={<StepForwardOutlined/>}
                type="primary"
                disabled={!this.state.canNext}
                onClick={() => {
                  that.nextStep();
                }}>下一步</Button>
            </Col>
            <Col span={2}>
              <Button
                icon={<PlayCircleOutlined/>}
                type="primary"
                disabled={!this.state.canAuto}
                onClick={() => {
                  that.autoRun();
                }}>自动</Button>
            </Col>
            <Col span={2}>
              <Button
                icon={<PauseCircleOutlined/>}
                type="primary"
                danger
                disabled={!this.state.canStop}
                onClick={() => {
                  that.stopAutoRun();
                }}>暂停</Button>
            </Col>
            <Col span={2}>
              <Button
                icon={<RedoOutlined/>}
                type="primary"
                onClick={() => {
                  that.newRound();
                }}>再来一遍</Button>
            </Col>
          </Row>
        </Card>
        <Card className={styles.dataCard} title={"原始数组"}>
          <Row className={styles.dataRow} justify="space-around">
            {originArr}
          </Row>
        </Card>
        <Card className={styles.dataCard} title={"排序数组"}>
          <Row className={styles.dataRow} justify="space-around">
            {currentStep}
          </Row>
        </Card>
        <Card className={styles.dataCard} title={"当前最小值"}>
          <Row className={styles.dataRow} justify="center">
            <Col className={this.state.currentStep.change ? styles.colChange : styles.col}
                 span={2}>下标:{this.state.currentStep.minIndex}</Col>
            <Col className={this.state.currentStep.change ? styles.colChange : styles.col}
                 span={2}>值:{this.state.currentStep.minValue}</Col>
          </Row>
        </Card>
      </PageContainer>
    )
  }
}

export default Bubble;
