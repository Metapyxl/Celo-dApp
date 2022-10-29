
export const awsconfig = {
    aws_cognito_region: 'us-east-1',
    aws_user_pools_id: 'us-east-1_5IasH4hXz',
    aws_user_pools_web_client_id: '4fihjghec705vg943g8oqh5goc',
    aws_mandatory_sign_in: 'enable',
    Analytics: {
        disabled: true,
    }
}

export const signUpConfig = {
    header: 'Create Metapyxl Account',
    hideAllDefaults: true,
    usernameAttributes: "username",
    defaultCountryCode: '1',
    signUpFields: [
        {
            label: 'Username',
            key: 'username',
            required: true,
            displayOrder: 1,
            type: 'string',
        },
        {
            label: 'Email',
            key: 'email',
            required: true,
            displayOrder: 2,
            type: 'string',
        },
        {
            label: 'Password',
            key: 'password',
            required: true,
            displayOrder: 3,
            type: 'string',
        },
    ],
};
