import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import React, {useState} from 'react';
import {Alert, Space, message, Tabs} from 'antd';
import ProForm, {ProFormCaptcha, ProFormCheckbox, ProFormText} from '@ant-design/pro-form';
import {Link, history, History, useModel} from 'umi';
import { accountLogin, LoginParamsType, getCaptcha } from "@/services/login";
import logo from '@/assets/logo.svg';
import Footer from '@/components/Footer';
import styles from './style.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  setTimeout(() => {
    const {query} = history.location;
    const {redirect} = query as { redirect: string };
    if (!redirect) {
      history.replace('/');
      return;
    }
    (history as History).replace(redirect);
  }, 10);
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const {initialState, setInitialState} = useModel('@@initialState');
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [type, setType] = useState<string>('account');
  const quarkInfo = initialState?.quarkInfo;

  /**
   * 用户登录
   */
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);

    try {
      const result = await accountLogin({...values, type});

      if (result.status === 'success' && initialState) {
        message.success(result.msg);
        // 记录登录凭据
        sessionStorage.setItem('token', result.data.token);
        const accountInfo = await initialState?.fetchUserInfo();
        const layoutInfo = await initialState?.fetchLayoutInfo();
        const quarkMenus = await initialState?.fetchMenusInfo();
        setInitialState({
          ...initialState,
          accountInfo: accountInfo.data,
          settings: layoutInfo.data,
          quarkMenus: quarkMenus.data
        });
        replaceGoto();
        // 设置用户登录状态
        setUserLoginState(result)
      } else {
        message.error(result.msg);
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    }

    setSubmitting(false);
  };

  const renderCaptchaText = (timing: boolean, count: number) => {
    return timing ? `${count} 后获取验证码` : '获取验证码'
  };

  const {status, type: loginType} = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={quarkInfo.logo ? quarkInfo.logo : logo}/>
              <span className={styles.title}>{quarkInfo.name ? quarkInfo.name : 'QuarkCMS'}</span>
            </Link>
          </div>
          <div className={styles.desc}>{quarkInfo.description ? quarkInfo.description : '信息丰富的世界里，唯一稀缺的就是人类的注意力'}</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '登录'
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab="账户密码登录"
              />
              <Tabs.TabPane
                key="mobile"
                tab="手机验证码登录"
              />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage content="账户或密码错误（admin/ant.design)"/>
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                  }}
                  placeholder='用户名/Email/手机号'
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon}/>,
                  }}
                  placeholder='密码: ant.design'
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误"/>}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileTwoTone className={styles.prefixIcon}/>,
                  }}
                  name="mobile"
                  placeholder='手机号'
                  rules={[
                    {
                      required: true,
                      message: '手机号是必填项！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '不合法的手机号！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <MailTwoTone className={styles.prefixIcon}/>,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder='请输入验证码'
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '验证码是必填项！',
                    },
                  ]}
                  onGetCaptcha={async (mobile) => {
                    renderCaptchaText(true, 60);

                    if (mobile === undefined) {
                      message.error('请填写手机号');
                      renderCaptchaText(false, 0);
                      return;
                    }

                    const result = await getCaptcha(mobile);

                    if (result.status === 'error') {
                      message.error(result.msg);
                      renderCaptchaText(false, 0);
                      return;
                    }

                    message.success(`获取验证码成功！验证码为：${result.data}`);
                  }}
                />
              </>
            )}
          </ProForm>
          <Space className={styles.other}>
            其他登录方式 :
            <AlipayCircleOutlined className={styles.icon}/>
            <TaobaoCircleOutlined className={styles.icon}/>
            <WeiboCircleOutlined className={styles.icon}/>
          </Space>
        </div>
      </div>
      <Footer/>
    </div>
  );

};

export default Login;
