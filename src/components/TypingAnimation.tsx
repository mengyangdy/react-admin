import clsx from "clsx";
import { type MotionProps, motion } from "motion/react";

interface TypingAnimationProps extends MotionProps {
  as?: React.ElementType;
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  startOnView?: boolean;
}

export function TypingAnimation({
  as: Component = "div",
  children,
  className,
  delay = 0,
  duration = 50,
  startOnView = false,
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });
  const [displayText, setDisplayText] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const elementRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }
    const ovserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setStarted(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (elementRef.current) {
      ovserver.observe(elementRef.current);
    }
  }, [startOnView, delay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayText(children.substring(0, i + 1));
        i += 1;
      } else {
        clearInterval(typingEffect);
      }
    });
  }, [children, duration, started]);

  return (
    <MotionComponent
      className={clsx("tracking-[-0.02em]", className)}
      ref={elementRef}
      {...props}
    >
      {displayText}
    </MotionComponent>
  );
}
export default TypingAnimation;
