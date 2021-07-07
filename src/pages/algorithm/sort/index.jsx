import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './index.less';

const CodePreview = ({ children }) => (
    <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default () => {
    const intl = useIntl();
    return (
        <PageContainer>
            <Card>
                <Typography.Text strong>
                    sdfasd
                </Typography.Text>
            </Card>
        </PageContainer>
    );
};
