import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
import { totp } from 'otplib';
totp.options = { digits: 8, algorithm: "sha512", epoch: Date.now(), step: 60 };

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return generate(req, res);
    case 'POST':
      return verify(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  function generate(req, res) {
    const code = totp.generate(serverRuntimeConfig.otpsecret);
    res.status(200).json({ code });
  }

  function verify(req, res) {
    const { code } = req.body;
    const check = totp.check(code, serverRuntimeConfig.otpsecret);
    res.status(200).json({ valid: check });
  }
}