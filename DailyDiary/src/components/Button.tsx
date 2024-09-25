import './Button.scss';

// Button Props 타입 정의
interface ButtonProps {
    text: React.ReactNode;
    type?: string // 버튼의 타입을 제한할 경우
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, type = 'primary', onClick }) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`Button Button_${type} m-0 g-0`}
        >
            {text}
        </button>
    );
}

export default Button;
