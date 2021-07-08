import {PageContainer} from '@ant-design/pro-layout';
import {Card, Row, Col, Button} from 'antd';
import React, {Component} from 'react';
import styles from './index.less';
import {StepForwardOutlined, PlayCircleOutlined, PauseCircleOutlined, RedoOutlined} from '@ant-design/icons';


let that;
let auto;
let cur = 0;

class InsertSort extends Component {
  state = {
    originArr: [],
    insertArr: [],
    process: [],
    currentStep: {
      originArr: [],
      insertArr: [],
    },
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

  copyArr(arr) {
    const result = [];
    for (let index = 0; index < arr.length; index += 1) {
      const node = {};
      node.value = arr[index].value;
      node.position = arr[index].position;
      node.state = arr[index].state;
      result.push(node);
    }
    return result;
  }

  buildStepNode(tempProcess, originArr, insertArr) {
    const stepNode = {
      originArr: this.copyArr(originArr),
      insertArr: this.copyArr(insertArr),
    };
    tempProcess.push(stepNode);
  }

  newRound() {
    cur = 0;
    const originTemp = [];
    const insertTemp = [];
    for (let c = 0; c < 10; c += 1) {
      const node = {
        value: 0,
        state: 0,
        position: 0,
      };
      node.value = Math.floor(Math.random() * 100);
      node.position = c;
      originTemp.push(node);
      const insertNode = {
        value: "",
        state: 0,
        position: 0,
      }
      insertTemp.push(insertNode);
    }
    const step = {
      originArr: that.copyArr(originTemp),
      insertArr: that.copyArr(insertTemp),
    }
    that.setState({
      currentStep: step
    });
    that.stopAutoRun();

    const tempProcess = [];
    // state = 0 默认状态
    // state = 1 选择
    // state = 2 符合预期
    // state = 3 不符合插入要求
    // state = 4 发生移动
    // state = 5 发生插入

    originTemp[0].state = 1;
    insertTemp[0].state = 1;
    that.buildStepNode(tempProcess, originTemp, insertTemp);

    originTemp[0].state = 2;
    insertTemp[0].state = 2;
    that.buildStepNode(tempProcess, originTemp, insertTemp);

    insertTemp[0].value = originTemp[0].value;
    originTemp[0].state = 5;
    insertTemp[0].state = 5;
    that.buildStepNode(tempProcess, originTemp, insertTemp);

    originTemp[0].state = 0;
    insertTemp[0].state = 0;
    that.buildStepNode(tempProcess, originTemp, insertTemp);

    for (let k = 1; k < originTemp.length; k += 1) {
      let inserted = false;
      for (let l = k - 1; l >= 0; l -= 1) {
        // 选择要比较的两个节点
        originTemp[k].state = 1;
        insertTemp[l].state = 1;
        that.buildStepNode(tempProcess, originTemp, insertTemp);
        if (originTemp[k].value < insertTemp[l].value) {
          // 不符合插入要求
          originTemp[k].state = 3;
          insertTemp[l].state = 3;
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 还原现场
          originTemp[k].state = 0;
          insertTemp[l].state = 0;
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 标记要移动的位置
          insertTemp[l].state = 4;
          insertTemp[l + 1].state = 4;
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 发生移动
          insertTemp[l + 1].value = insertTemp[l].value;
          insertTemp[l].value = "";
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 还原移动后的现场
          insertTemp[l].state = 0;
          insertTemp[l + 1].state = 0;
          that.buildStepNode(tempProcess, originTemp, insertTemp);
        } else {
          // 符合插入要求
          originTemp[k].state = 2;
          insertTemp[l].state = 2;
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 还原现场
          originTemp[k].state = 0;
          insertTemp[l].state = 0;
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 标注要插入的位置
          originTemp[k].state = 5;
          insertTemp[l + 1].state = 5;
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 发生插入
          insertTemp[l + 1].value = originTemp[k].value;
          that.buildStepNode(tempProcess, originTemp, insertTemp);

          // 还原现场
          originTemp[k].state = 0;
          insertTemp[l].state = 0;
          insertTemp[l + 1].state = 0;
          that.buildStepNode(tempProcess, originTemp, insertTemp);
          inserted = true;
          break;
        }
      }
      // 如果未发生插入,放到第一个位置
      if (!inserted) {
        // 标注要插入的位置
        originTemp[k].state = 5;
        insertTemp[0].state = 5;
        that.buildStepNode(tempProcess, originTemp, insertTemp);

        // 发生插入
        insertTemp[0].value = originTemp[k].value;
        that.buildStepNode(tempProcess, originTemp, insertTemp);

        // 还原现场
        originTemp[k].state = 0;
        insertTemp[0].state = 0;
        that.buildStepNode(tempProcess, originTemp, insertTemp);
      }
    }

    that.setState({
      process: tempProcess,
    });

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


  nextStep() {
    if (cur >= that.state.process.length) {
      that.stopAll();
      return;
    }
    const step = that.state.process[cur];
    cur += 1;
    that.setState({
      currentStep: step,
    });
  }


  render() {

    const originArr = this.state.currentStep.originArr.map((item) => {
      if (item.state === 1) {
        return (<Col key={item.position} className={styles.chooseCol} span={1}>{item.value}</Col>);
      }
      if (item.state === 2) {
        return (<Col key={item.position} className={styles.chooseFit} span={1}>{item.value}</Col>);
      }
      if (item.state === 3) {
        return (<Col key={item.position} className={styles.chooseUnFit} span={1}>{item.value}</Col>);
      }
      if (item.state === 4) {
        return (<Col key={item.position} className={styles.colSwap} span={1}>{item.value}</Col>);
      }
      if (item.state === 5) {
        return (<Col key={item.position} className={styles.colFix} span={1}>{item.value}</Col>);
      }
      return (<Col key={item.position} className={styles.col} span={1}>{item.value}</Col>);
    });

    const insertArr = this.state.currentStep.insertArr.map((item) => {
      if (item.state === 1) {
        return (<Col key={item.position} className={styles.chooseCol} span={1}>{item.value}</Col>);
      }
      if (item.state === 2) {
        return (<Col key={item.position} className={styles.chooseFit} span={1}>{item.value}</Col>);
      }
      if (item.state === 3) {
        return (<Col key={item.position} className={styles.chooseUnFit} span={1}>{item.value}</Col>);
      }
      if (item.state === 4) {
        return (<Col key={item.position} className={styles.colSwap} span={1}>{item.value}</Col>);
      }
      if (item.state === 5) {
        return (<Col key={item.position} className={styles.colFix} span={1}>{item.value}</Col>);
      }
      return (<Col key={item.position} className={styles.col} span={1}>{item.value}</Col>);
    });
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
        <Card className={styles.dataCard} title={"目标数组"}>
          <Row className={styles.dataRow} justify="space-around">
            {insertArr}
          </Row>
        </Card>
      </PageContainer>
    );
  }
};

export default InsertSort;
