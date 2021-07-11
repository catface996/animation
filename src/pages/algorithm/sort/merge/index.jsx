import {PageContainer} from '@ant-design/pro-layout';
import {Card, Row, Col, Grid, Button} from 'antd';
import React, {Component} from 'react';
import styles from './index.less';
import {StepForwardOutlined, PlayCircleOutlined, PauseCircleOutlined, RedoOutlined} from '@ant-design/icons';


let that;
let i = 0;
let j = 0;
let p = 0;
let auto;
const sleep = (numberMillis) => {
    let now = new Date();
    let exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

class MergeSort extends Component {
    state = {
        arr: [],
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
     * componentWillMount()一般用的比较少，它更多的是在服务端渲染时使用。
     * 它代表的过程是组件已经经历了constructor()初始化数据后，但是还未渲染DOM时。
     */
    componentWillMount() {
        this.newRound();
    }

    /**
     * 组件第一次渲染完成，此时dom节点已经生成，可以在这里调用ajax请求，返回数据setState后组件会重新渲染
     */
    componentDidMount() {
    }

    /**
     * 在接受父组件改变后的props需要重新渲染组件时用到的比较多
     * 接受一个参数nextProps
     * 通过对比nextProps和this.props，将nextProps的state为当前组件的state，从而重新渲染组件
     * @param nextProps
     */
    componentWillReceiveProps() {
        // console.log('componentWillReceiveProps', nextProps)
    }

    /**
     * 在此处完成组件的卸载和数据的销毁。
     * clear你在组建中所有的setTimeout,setInterval
     * 移除所有组建中的监听 removeEventListener
     */
    componentWillUnmount() {
    }

    /*
     * componentWillUpdate (nextProps,nextState)
     * shouldComponentUpdate返回true以后，组件进入重新渲染的流程，进入componentWillUpdate,这里同样可以拿到nextProps和nextState。
     * componentDidUpdate(prevProps,prevState)
     * 组件更新完毕后，react只会在第一次初始化成功会进入componentDidmount,之后每次重新渲染后都会进入这个生命周期，
     * 这里可以拿到prevProps和prevState，即更新前的props和state。
     */

    newRound() {
        let temp = new Array();
        for (let i = 0; i < 10; i++) {
            let node = {
                value: 0,
                choose: 0
            };
            node.value = Math.floor(Math.random() * 100);
            temp[i] = node;
        }
        i = temp.length - 1;
        j = 0;
        p = 0;
        that.setState({
            arr: temp
        });
        that.stopAutoRun();
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
        let temp = that.state.arr.slice();
        console.log(i, ":", j)
        if (i > 0) {
            if (p === 0) {
                // 开始选择
                if (j < temp.length - 1) {
                    // 可以选择
                    temp[j].choose = 1;
                    temp[j + 1].choose = 1;
                    p = 1;
                    that.setState({
                        arr: temp
                    })
                }
            } else if (p === 1) {
                if (temp[j].value <= temp[j + 1].value) {
                    temp[j].choose = 0;
                    temp[j + 1].choose = 0;
                    p = 0;
                    j++;
                    if (j >= i) {
                        temp[i].choose = 3;
                        j = 0;
                        i--;
                    }
                } else {
                    temp[j].choose = 2;
                    temp[j + 1].choose = 2;
                    let value = temp[j].value;
                    temp[j].value = temp[j + 1].value;
                    temp[j + 1].value = value;
                }
                that.setState({
                    arr: temp
                });
            }
        } else if (i === 0) {
            temp[i].choose = 3;
            that.setState({
                arr: temp,
            });
            that.stopAll();
        }

    }


    render() {
        const arrCol = this.state.arr.map(item => {
                if (item.choose === 0) {
                    return <Col className={styles.col} span={1}>{item.value}</Col>
                } else if (item.choose === 1) {
                    return <Col className={styles.chooseCol} span={1}>{item.value}</Col>
                } else if (item.choose === 2) {
                    return <Col className={styles.colSwap} span={1}>{item.value}</Col>
                } else {
                    return <Col className={styles.colFix} span={1}>{item.value}</Col>
                }
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
                <Card className={styles.dataCard}>
                    <Row className={styles.dataRow} justify="space-around">
                        {arrCol}
                    </Row>
                </Card>
            </PageContainer>
        );
    }
};

export default MergeSort;
