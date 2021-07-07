import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Alert, Typography} from 'antd';
import {useIntl, FormattedMessage} from 'umi';
import styles from './index.less';


export default () => {
    return (
        <PageContainer>
            <Card>
                这里将展示插入排序
            </Card>
        </PageContainer>
    );
};
