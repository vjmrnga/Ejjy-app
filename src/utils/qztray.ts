const authenticateQZTray = (qz) => {
  // Authentication setup
  qz.security.setCertificatePromise(function (resolve, reject) {
    resolve(
      "-----BEGIN CERTIFICATE-----\n" +
        "MIID0TCCArmgAwIBAgIUaDAsSKn5X23jaK5xvesh/G+dG9YwDQYJKoZIhvcNAQEL\n" +
        "BQAwdzELMAkGA1UEBhMCUEgxDTALBgNVBAgMBENlYnUxDTALBgNVBAcMBENlYnUx\n" +
        "DTALBgNVBAoMBEVKSlkxDTALBgNVBAsMBEVKSlkxDTALBgNVBAMMBEVKSlkxHTAb\n" +
        "BgkqhkiG9w0BCQEWDmVqanlAZ21haWwuY29tMCAXDTIxMDMxODExNTYwMFoYDzIw\n" +
        "NTIwOTEwMTE1NjAwWjB3MQswCQYDVQQGEwJQSDENMAsGA1UECAwEQ2VidTENMAsG\n" +
        "A1UEBwwEQ2VidTENMAsGA1UECgwERUpKWTENMAsGA1UECwwERUpKWTENMAsGA1UE\n" +
        "AwwERUpKWTEdMBsGCSqGSIb3DQEJARYOZWpqeUBnbWFpbC5jb20wggEiMA0GCSqG\n" +
        "SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDl8JPChLBfKjHaKqw1rWxQKR/31aXikR+Z\n" +
        "CUkVOhP+N9BqMLskizWAnFIIq5iTI0ErYO6D2d+Rrn+SYpbNPiNCp1+WkmZwDl3o\n" +
        "RHIEL01Qul21eQFFss0HVD6Bed/ABWkQuxRZlo2NFVMS9sD0nFzWlGjk6DkFvgEi\n" +
        "kwgsTKzuF3FusCpajTFm0dR2V7B4OGTdlnOv8fq57pRAxJ1kdK5h53trtrve+HrA\n" +
        "dAgJj2QdhtJRkg7UvqEroR7NBjgb0T4rkgfPKDvtRl1t+sSePu9a41zxFQ7PXSjx\n" +
        "cTUPBu+emgLwhCI+f7ijX4O4xd9UFM7m5RDU7Rxzp74jlfezw3I/AgMBAAGjUzBR\n" +
        "MB0GA1UdDgQWBBQfsMynx4euCPD6No5re42teW/BezAfBgNVHSMEGDAWgBQfsMyn\n" +
        "x4euCPD6No5re42teW/BezAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA\n" +
        "A4IBAQBI1lCyFxWaeDUZcJJ49fbg0xzxGKzzsm99ur02e68tfwhK3uYSOhjLyzXJ\n" +
        "V0Z/4h5oGKlwNHRS+dZkJCLQ6PM8iekFBhfj6bfiT6Q6aVytiaiyHicATLuFn0Xd\n" +
        "LX8yJsqxnWoMvV4ne6jq+xROyY4QTKT/9Fn+dbzmrejvgBJ4dAHStdQlB+BRwa05\n" +
        "/ay8LPTA9eh4uxwaW5W7rHyVXjliBa+TxNlQ+60z84BFqc2zO1/guBPbI+Y1nqs5\n" +
        "rwwajZypAALkDgSCW7L837upVVZn4pH+eQkzVpb6EuftXs3CJv89cJiBux2wVDFD\n" +
        "JwviDu5h2Z88yECPLNy9qRTDcHoa\n" +
        "-----END CERTIFICATE-----"
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const privateKey =
    "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDl8JPChLBfKjHa\n" +
    "Kqw1rWxQKR/31aXikR+ZCUkVOhP+N9BqMLskizWAnFIIq5iTI0ErYO6D2d+Rrn+S\n" +
    "YpbNPiNCp1+WkmZwDl3oRHIEL01Qul21eQFFss0HVD6Bed/ABWkQuxRZlo2NFVMS\n" +
    "9sD0nFzWlGjk6DkFvgEikwgsTKzuF3FusCpajTFm0dR2V7B4OGTdlnOv8fq57pRA\n" +
    "xJ1kdK5h53trtrve+HrAdAgJj2QdhtJRkg7UvqEroR7NBjgb0T4rkgfPKDvtRl1t\n" +
    "+sSePu9a41zxFQ7PXSjxcTUPBu+emgLwhCI+f7ijX4O4xd9UFM7m5RDU7Rxzp74j\n" +
    "lfezw3I/AgMBAAECggEBAMQysuGXNqb86eyt3KMwhusfLBfcRN891ShPs/xYwhZ4\n" +
    "qWzyh7x2zAAhYh3jzRw/SKwq2VnH3ewAaPoPBX27N3r4NafU43NZzucQ//hyJBZt\n" +
    "7ueZiGxgVHGcgHkZ9MFz3GJaPtLyk3V+bJQR2DLf+JdfquEnBQDRT0ahDqg+BJBh\n" +
    "8kCwJ5G4LMoD04x2n4OF9F5iCueVjOVQFEZMiffYiHBRDGLqOeDZNgX94ZnM7Yrt\n" +
    "Nl8RR0V1VCGM4L4Rx1Csc+x38+E2inwb4A/SvtIIZthd9nNIHkg9X5eayq2BL4a2\n" +
    "gzRtPbPRG4XYAwlXzbVNm8NPxBO2fgcfJekjoU2LeAECgYEA+cGT1I/MXLmpN55o\n" +
    "VNGTLs7hM+OrXqcJOnC+zNlpLZ2YixSqCcASE8SfdrRN02jg874dFdKInzsgSBl0\n" +
    "RVNE8M030tLS9K8ZiWdOECxK4AFx7CkYDuKXIm6xlZbf5oNPKPDCUggPzbNfOr/W\n" +
    "pdGz3yr4cHAUeBq4fpuVyFb0e/8CgYEA67AtEi0NdFiOElTGgRtzOGGrBnluSg9k\n" +
    "1LFUCq58OsZjnBZXfwQ5SXf3i5Wlu/V++BVKKsk9b1b4zr2X7hWWUOq2pMrqpk5V\n" +
    "bMRMrwDAvv5NHX48DwMiSAthfUxL0cTCa1hib3Km7ftpWsPtSbXR4RSTAtKYit5C\n" +
    "CAuCccrqCcECgYEAxPmVxLPwgkTvH21wbUyoXudMl6b8Vfc5AP1AjcD+AbrkPvR6\n" +
    "Mpxn5W1SMsV7B7wUhkevGrHjjGmOSS7CE5bbrWq8lyostEuQwVxXJcw49ThOh+nV\n" +
    "DpBIkCBrMEZAqcVv3iMbrqSrChlohqYb/MVJrj1umQbcLektDrVYSRvDUDMCgYEA\n" +
    "tDoFTSfcaQKqqYPgQ6v9ALlW8d17o/B/l1F+xahF4SAB3cML51oQgIjXaAroMIH7\n" +
    "NLP7Ahre+rwUCOvcOTiSuI+zWPK+Wqv+EO1PAmfd/G80AwCb5pLr7RGe3BSyydbf\n" +
    "IPz2UOjok4U0PC8kzb/WnXqBLKBj+5UYA1ThzChxrUECgYBHNWU+U73eI0t3eshF\n" +
    "LRG73tlIcSHWVHOIQj7a4Eah+oHfWBAOXz8SrcPyCJOzPQuIn12y7fHMaBuBVdu2\n" +
    "GVIghp5ztgXYWakpAxR1N1RFx04zFaAiBKFUesQYV8QpN+EkSOFORGnkPBIEJ4GS\n" +
    "XxwqM7+VsuQCNx2WcHmO4bDN2A==\n" +
    "-----END PRIVATE KEY-----";

  qz.security.setSignatureAlgorithm("SHA512"); // Since 2.1
  qz.security.setSignaturePromise(function (toSign) {
    return function (resolve, reject) {
      try {
        const pk = eval("KEYUTIL.getKey(privateKey);");
        const sig = eval(
          'new KJUR.crypto.Signature({"alg": "SHA512withRSA"});'
        );
        sig.init(pk);
        sig.updateString(toSign);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hex = sig.sign();
        resolve(eval("stob64(hextorstr(hex))"));
      } catch (err) {
        console.error(err);
        reject(err);
      }
    };
  });
};

export default authenticateQZTray;
