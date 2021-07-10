import {PageContainer} from '@ant-design/pro-layout';
import {Card, Row, Col, Button} from 'antd';
import React, {Component} from 'react';
import styles from './index.less';
import {StepForwardOutlined, PlayCircleOutlined, PauseCircleOutlined, RedoOutlined} from '@ant-design/icons';


let that;
let auto;
let current = 0;

class Bubble extends Component {

  state = {
    originArr: [],
    sortArr: [],
    progress: [],
    stackSnapshots: [],
    currentSnapshot: [],
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
    that.newRound();
  }


  /**
   * 在此处完成组件的卸载和数据的销毁。
   * clear你在组建中所有的setTimeout,setInterval
   * 移除所有组建中的监听 removeEventListener
   */
  componentWillUnmount() {

  }

  newRound() {
    current = 0;
    const process = [];
    const originArr = [];
    const sortArr = [];
    for (let i = 0; i < 10; i += 1) {
      const originNode = {
        value: 0,
        position: 0,
        state: 0,
      };
      const sortNode = {
        value: 0,
        position: 0,
        state: 0,
      };
      const value = Math.floor(Math.random() * 100);
      originNode.value = value;
      originNode.position = i;
      sortNode.value = value;
      sortNode.position = i;
      originArr.push(originNode);
      sortArr.push(sortNode);
    }
    that.quickSort(sortArr, 0, sortArr.length - 1, 0, process);

    const snapshotStack = [];
    const snapshot = [];
    snapshot.push(process[0]);
    for (let j = 0; j < process.length; j += 1) {
      while (snapshot.length >= 1 && process[j].depth <= snapshot[snapshot.length - 1].depth) {
        snapshot.pop();
      }
      snapshot.push(process[j]);
      snapshotStack.push(that.copyStackNodes(snapshot));
    }

    that.setState({
      originArr,
      sortArr,
      snapshotStack,
      currentSnapshot: [],
    });

    that.stopAutoRun();

  }

  quickSort(sortArr, L, R, depth, process) {
    if (L >= R) {
      return;
    }
    const pivot = L + Math.floor(Math.random() * (R - L));
    const pivotValue = sortArr[pivot].value;
    let less = L - 1;
    let more = R + 1;
    let cur = L;
    let tempNode;

    tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
    process.push(tempNode);

    while (cur < more) {

      // 标记当前选择的节点
      sortArr[cur].state = 1;
      tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
      process.push(tempNode);

      if (sortArr[cur].value < pivotValue) {
        // 标记当前节点小于 标尺值
        sortArr[cur].state = 2;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);

        less += 1;
        const lessValue = sortArr[less].value;
        sortArr[less].value = sortArr[cur].value;
        sortArr[cur].value = lessValue;

        // 标记交换偶的情况
        sortArr[cur].state = 4;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);

        // 还原现场
        sortArr[cur].state = 0;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);
        cur += 1;

      } else if (sortArr[cur].value > pivotValue) {

        // 标记当前值大于标尺值
        sortArr[cur].state = 2;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);

        more -= 1;
        const moreValue = sortArr[more].value;
        sortArr[more].value = sortArr[cur].value;
        sortArr[cur].value = moreValue;

        // 标记交换偶的情况
        sortArr[cur].state = 4;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);

        // 还原现场
        sortArr[cur].state = 0;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);

      } else {

        // 标记当前值等于标尺值
        sortArr[cur].state = 3;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);

        // 还原现场
        sortArr[cur].state = 0;
        tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
        process.push(tempNode);

        cur += 1;

      }

    }


    // 排序
    that.quickSort(sortArr, L, less, depth + 1, process);
    that.quickSort(sortArr, more, R, depth + 1, process);

    // 保存栈
    tempNode = that.buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth);
    process.push(tempNode);
  }

  autoRun() {
    auto = setInterval(that.nextStep, 500);
    that.setState({
      canNext: false,
      canAuto: false,
      canStop: true,
    });
  }

  buildStackNode(sortArr, L, R, less, more, cur, pivot, pivotValue, depth) {
    const result = {
      sortArr: that.copySortArr(sortArr),
      pivot,
      pivotValue,
      L,
      R,
      less,
      more,
      cur,
      depth,
    }
    return result;
  }

  copyStackNode(stackNode) {
    return {
      sortArr: that.copySortArr(stackNode.sortArr),
      pivot: stackNode.pivot,
      pivotValue: stackNode.pivotValue,
      L: stackNode.L,
      R: stackNode.R,
      less: stackNode.less,
      more: stackNode.more,
      cur: stackNode.cur,
      depth: stackNode.depth,
    }
  }

  copyStackNodes(nodes) {
    const newNodes = [];
    for (let i = 0; i < nodes.length; i += 1) {
      newNodes.push(that.copyStackNode(nodes[i]));
    }
    return newNodes;
  }

  copySortArr(sortArr) {
    const result = [];
    for (let i = 0; i < sortArr.length; i += 1) {
      const arrNode = {};
      arrNode.value = sortArr[i].value;
      arrNode.position = sortArr[i].position;
      result.push(arrNode);
    }
    return result;
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
    if (current >= that.state.snapshotStack.length) {
      that.stopAll();
      return;
    }
    that.setState({
      currentSnapshot: that.state.snapshotStack[current],
    });
    current += 1;
  }


  render() {
    const originArr = this.state.originArr.map(item => {
        return (<Col key={item.position} className={styles.col} span={1}>{item.value}</Col>);
      }
    );

    const sortArr = [];
    for (let i = this.state.currentSnapshot.length-1; i >=0 ; i-=1) {
      const item = this.state.currentSnapshot[i];
      const cols = item.sortArr.map(node => {
        let st = ``;
        st += `${styles.col} `;
        if (node.position < item.L || node.position > item.R) {
          st += `${styles.notChoose} `;
        } else {
          st += `${styles.chooseCol} `;
          if (node.position === item.cur) {
            st += `${styles.curStyle} `;
          }
          if (node.position >= item.more) {
            st += `${styles.moreStyle} `;
          }
          if (node.position <= item.less) {
            st += `${styles.lessStyle} `;
          }
        }
        return (<Col key={node.position} className={st} span={1}>{node.value}</Col>);
      });

      const card =  (
        <Card key={i} className={styles.dataCard}
              title={`depth=${item.depth}; pivotValue=${item.pivotValue}; less=${item.less
              }; L=${item.L}; cur=${item.cur}; R=${item.R}; more=${item.more}`}>
          <Row key={i} className={styles.dataRow} justify="space-around">
            {cols}
          </Row>
        </Card>
      );
      sortArr.push(card);
    }
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
        <Card className={styles.dataCard}>
          <Row className={styles.dataRow} justify="space-around">
            {originArr}
          </Row>
        </Card>
        {sortArr}
      </PageContainer>
    );
  }

};

export default Bubble;
