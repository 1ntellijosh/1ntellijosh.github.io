import styles from './StartButton.module.css';

interface StartButtonProps {
    onClick: () => void;
}

export default function StartButton({ onClick }: StartButtonProps) {
    return (
        <div className={styles.buttonWrap}>
            <button id="start" onClick={onClick}>
                Start
            </button>
        </div>
    );
}
