<!--  -->
<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="item in menuTab" :key="item.id" :class="{'current':item.current}" @click="toggleMenu(item)">{{item.txt}}</li>
      </ul>
      <!--表单开始-->
      <el-form :model="ruleForm" size="medium" :rules="rules" ref="ruleForm" class="demo-ruleForm login-form">
        <el-form-item prop="username">
          <label for="username">账号</label>
          <el-input type="text" id="username" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label for="password">密码</label>
          <el-input type="password" id="password" minlength="6" maxlength="20" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="passwords" v-show="model==='register'">
          <label for="passwords">密码确认</label>
          <el-input type="password" id="passwords" minlength="6" maxlength="20" v-model="ruleForm.passwords" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model.number="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="btn-block" @click="getSmss">{{vcodesend}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :disabled="ableClick" class="login-btn btn-block" @click="submitForm('ruleForm')">{{model==='login'?'提交':'注册'}}</el-button>
        </el-form-item>
      </el-form>
      <!--表单结束-->
    </div>
  </div>
</template>

<script>
import { reactive, ref, isRef, onMounted } from "@vue/composition-api";
import { Message } from 'element-ui'
import { getSms, register, login } from '@/api/login'
import { stripscript } from '@/utils/validate.js'
export default {
  name: "login",
  setup(props, { refs, root }) {
    const menuTab = reactive([
      { id: 0, txt: '登录', current: true },
      { id: 1, txt: '注册', current: false }
    ]);
    const model = ref('login');
    const ableClick = ref(true);
    const vcodesend = ref("发送验证码")
    const ruleForm = reactive(
      {
        username: '',
        password: '',
        passwords: '',
        code: ''
      }
    )
    let code = (rule, value, callback) => {
      let reg = /^[a-z0-9]{6}$/;
      if (!value) {
        return callback(new Error('验证码不能为空'));
      } else if (!reg.test(value)) {
        callback(new Error("验证码格式不正确"))
      } else {
        callback()
      }
    }
    let initparam = () => {
      ableClick.value = true;
      vcodesend.value = "发送验证码"
    }
    let validateUsername = (rule, value, callback) => {
      let reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    }
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {

        callback();
      }
    }
    let validatePasswords = (rule, value, callback) => {
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== ruleForm.password) {
        callback(new Error('与上次输入密码不一'));
      } else {

        callback();
      }
    }
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      passwords: [{ validator: validatePasswords, trigger: 'blur' }],
      code: [{ validator: code, trigger: 'blur' }]
    })

    const toggleMenu = ((item) => {
      menuTab.forEach(e => e.current = false);
      item.current = true;
      model.value = model.value === 'login' ? 'register' : 'login'
      initparam()
    })
    let loginfunc = async () => {
      let result = await login(ruleForm);
      console.log(result)
    }
    let registerfunc = async () => {
      let result = await register(ruleForm);
      console.log(result)
    }
    const submitForm = ((formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          root.Message.error("请检查数据")
        } else {
          switch (model.value) {
            case "login":
              loginfunc();
              break;
            case "register":
              registerfunc();
              break;
          }
        }
      });
    })
    const getSmss = async () => {
      if (!ruleForm.username) { alert('邮箱不能为空!'); return }
      if (!ruleForm.password) { alert('密码不能为空!'); return }

      let result = await getSms({ username: ruleForm.username, module: model.value });
      if (result.resCode === 0) {
        vcodesend.value = "验证码已发送"
        ableClick.value = false;
      }
      console.log(result)

    }

    onMounted(() => {

    })
    return {
      menuTab,
      model,
      toggleMenu,
      submitForm,
      ruleForm,
      rules,
      getSmss,
      ableClick,
      vcodesend


    }
  }

}

</script>
<style lang='less' scoped >
#login {
  height: 100vh;
  background-color: #344a5f;
  color: #fff;
}
.login-wrap {
  width: 380px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: #355a5f;
  }
}
#login ::v-deep .login-form {
  margin-top: 30px;
  width: 300px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
    text-align: left;
  }
  .item-form {
    margin-bottom: 13px;
  }
}
.btn-block {
  display: block;
  width: 100%;
}
.login-btn {
  margin-top: 20px;
}
</style>