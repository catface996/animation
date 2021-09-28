import {PageContainer} from '@ant-design/pro-layout';
import {Card, Row, Col, Button} from 'antd';
import React, {Component} from 'react';
import styles from './index.less';
import {StepForwardOutlined, PlayCircleOutlined, PauseCircleOutlined, RedoOutlined} from '@ant-design/icons';
import {boolean} from "@/.umi/.cache/.mfsu/mf-dep_vendors-node_modules__swagger-ui-react_3_51_1_swagger-ui-react_index_js.5ea0745d.async";


let that;
let auto;
let current = 0;

class AStar extends Component {

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
  }


  /**
   * 在此处完成组件的卸载和数据的销毁。
   * clear你在组建中所有的setTimeout,setInterval
   * 移除所有组建中的监听 removeEventListener
   */
  componentWillUnmount() {

  }

  generateTable(size) {
    let flag = true;
    const rows = [];
    for (let i = 0; i < size; i++) {
      const cols = [];
      for (let j = 0; j < size; j++) {
        if(flag){
          cols.push(<th className={styles.t_col_true}>9</th>);
        }else{
          cols.push(<th className={styles.t_col_false}>9</th>);
        }
        flag = !flag;
      }
      const row = (<tr className={styles.t_row}>{cols}</tr>);
      rows.push(row);
    }
    return <table border="1">{rows}</table>;
  }

  render() {

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
                }}>下一步</Button>
            </Col>
            <Col span={2}>
              <Button
                icon={<PlayCircleOutlined/>}
                type="primary"
                disabled={!this.state.canAuto}
                onClick={() => {
                }}>自动</Button>
            </Col>
            <Col span={2}>
              <Button
                icon={<PauseCircleOutlined/>}
                type="primary"
                danger
                disabled={!this.state.canStop}
                onClick={() => {
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
        <Card className={styles.dataCard} title={"A * 算法"}>
          {this.generateTable(25)}
        </Card>
      </PageContainer>
    );
  }
};

export default AStar;
