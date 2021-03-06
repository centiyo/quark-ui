import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import styles from './Style.less';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu, Form, Input, Button } from 'antd';

interface IProps {
  dispatch:Dispatch<any>;
  submitting: boolean;
}

class SecurityPage extends Component<IProps> {

  formRef: React.RefObject<any> = React.createRef();

  state = {
    msg: '',
    url: '',
    data: {
      username: '',
      nickname: '',
      email: '',
    },
    status: '',
    pagination: {},
    loading: false,
  };

  onFinish = (values:any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'request/post',
      payload: {
        actionUrl: 'admin/account/password',
        ...values
      }
    });
  };

  handleMenuClick = (e: any) => {
    if (e.key === 'info') {
      history.push('/account/settings/info');
      return;
    }
    if (e.key === 'security') {
      history.push('/account/settings/security');
      return;
    }
  };

  render() {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <PageHeaderWrapper title={'个人设置'}>
        <div className={styles.container}>
          <div className={styles.sider}>
            <Menu
              onClick={this.handleMenuClick}
              style={{ width: 256, minHeight: 500 }}
              defaultSelectedKeys={['security']}
              mode="inline"
            >
              <Menu.Item key="info">基本信息</Menu.Item>
              <Menu.Item key="security">账户安全</Menu.Item>
            </Menu>
          </div>
          <div className={styles.content}>
            <div>
              <span className={styles.title}>账户安全</span>
            </div>
            <div style={{ marginTop: 20 }}>
              <Form ref={this.formRef} onFinish={this.onFinish}>
                <Form.Item
                  {...formItemLayout}
                  label="原密码" 
                  name={'oldPassword'}
                >
                  <Input
                    className={styles.smallItem}
                    type="password"
                    placeholder="请输入原密码"
                  />
                </Form.Item>
                <Form.Item 
                  label="新密码"
                  name={'password'}
                  {...formItemLayout}
                >
                  <Input
                    className={styles.smallItem}
                    type="password"
                    placeholder="请输入新密码"
                  />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label="确认密码"
                  name={'repassword'}
                >
                  <Input
                    className={styles.smallItem}
                    type="password"
                    placeholder="请输入确认密码"
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

function mapStateToProps(state:any) {
  const { submitting } = state.request;
  return {
    submitting
  };
}

export default connect(mapStateToProps)(SecurityPage);