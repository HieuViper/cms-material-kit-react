import { useState } from 'react';
import { AsyncStorage } from 'AsyncStorage';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { callNon } from '../../../utils/api';
import useAuth from '../../../utils/Auth';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [tempData, setTempData] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  // console.log(email, password);

  const handleClick = (e) => {
    // navigate('/dashboard', { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = callNon('users/login', 'post', { email, password });
    data.then((response) =>
      AsyncStorage.setItem('token-admin', JSON.stringify(response)).then(navigate('/dashboard/app'))
    );
  };

  // useEffect(() => {
  //   axios
  //     .post('https://api.dpsoft.vn/auth/login', {
  //       phone: '0902251216',
  //       password: 'dpsoft243',
  //     })
  //     .then((response) => {
  //       // handle success
  //       // setTempData()
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       // handle error
  //       console.log(error);
  //     });
  // }, []);
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </form>
  );
}
