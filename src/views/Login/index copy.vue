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
          <label>账号</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label>密码</label>
          <el-input type="password" minlength="6" maxlength="20" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model.number="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="btn-block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" class="login-btn btn-block" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
      <!--表单结束-->
    </div>
  </div>
</template>

<script>
import { stripscript } from '@/utils/validate.js'
export default {
  data() {
    var code = (rule, value, callback) => {
      let reg = /^[a-z0-9]{6}$/;
      if (!value) {
        return callback(new Error('验证码不能为空'));
      } else if (!reg.test(value)) {
        callback(new Error("验证码格式不正确"))
      } else {
        callback()
      }

    };
    var validateUsername = (rule, value, callback) => {
      let reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {

        callback();
      }
    };
    return {

      menuTab: [
        { id: 0, txt: '登录', current: true },
        { id: 1, txt: '注册', current: false }
      ],
      ruleForm: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        code: [
          { validator: code, trigger: 'blur' }
        ]
      }
    };
  },
  props: {},
  created() { },
  mounted() { },
  methods: {
    toggleMenu(item) {
      this.menuTab.forEach(e => e.current = false);
      item.current = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

  }
}

</script>
<style lang='less' scoped >
#login {
  height: 100vh;
  background-color: #344a5f;
  color: #fff;
  position: relative;
}
.login-wrap {
  width: 380px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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