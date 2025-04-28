import { API_BASE } from '@/utils/api';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { saveUserId } from '../utils/auth'; // 위치는 프로젝트 구조에 따라 조정






export default function LoginScreen() {
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/signup'); // 회원가입 페이지로 이동
  };


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.status === 200 && data.user) {
        console.log('✅ 로그인 성공:', data);
  
        // userId 저장
        await saveUserId(data.user._id); // _id가 서버에서 오는 user의 id라고 가정
  
        router.replace('/main');
      } else {
        console.log('❌ 로그인 실패:', data.message);
      }
    } catch (err) {
      console.error('로그인 중 오류:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Note App 📝</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

    <View style={styles.buttonContainer}>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonOutline]}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonOutlineText}>회원가입</Text>
        </TouchableOpacity>


      </View>
      <TouchableOpacity onPress={() => router.push('/findpassword')}>
      <Text style={styles.findText}>🔐 비밀번호 찾기</Text>
    </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    gap:10,
  },
  button: {
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 1
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonOutlineText: {
    color:'black',
    fontWeight: '500',
    fontSize: 16
  },
  findText: {
    marginTop: 20,
    color: '#444',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },


});
