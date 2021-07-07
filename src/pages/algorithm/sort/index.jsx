import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';


export default () => {
    return (
        <PageContainer>
            <Card>
                <Typography.Text strong>
                    排序算法集锦
                </Typography.Text>
            </Card>
        </PageContainer>
    );
};
