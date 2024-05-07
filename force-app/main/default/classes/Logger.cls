/**
* @author tomcarman 
* @description Logging framework using Platform Events
*/

public class Logger {


    /**
     * @description current instance of this class that will be returned by get() method
     */
    private static Logger currentInstance;


    /**
     * @description Singleton pattern that returns the current instance of this class, or constructs a new one 
     *              if it doesnt exist yet
     * @return      `Logger`
     */
    public static Logger get() {
        if (currentInstance == null) {
            currentInstance = new Logger();
        }
        return currentInstance;
    }


    /**
     * @description private constructor to enforce singleton pattern. Constructor initialises a stack.
     */
    private Logger() {
        stack = new List<Log>();
    }


    /**
     * @description private list of logs that are yet to be published. Primarily used to allow multiple logs to
     *              be published in a single EventBus call, minimising limit usage.
     */
    private List<Log> stack;


    /**
     * @description Add a log to the stack without publishing it. 
     * @param       obj An object to be parsed into a log message. 
     *                  Currently suported objects are `String`, `Exception`, `DMLException`
     *              To add support for additional objects, the Log.cls should be subclassed.
     */
    public void add(Object obj) {
        this.add(obj, LogSeverity.INFO);
    }

    /**
     * @description Add a log to the stack without publishing it. 
     * @param       obj An object to be parsed into a log message. 
     *                  Currently suported objects are `String`, `Exception`, `DMLException`
     *              To add support for additional objects, the Log.cls should be subclassed.
     * @param       severity LogSeverity enum
     */
    public void add(Object obj, LogSeverity severity) {

        if(obj instanceof String) {
            this.stack.add(new Log((String)obj, severity));
        }

        else if(obj instanceof DmlException) {
            this.stack.add(new LogDMLExceptn((DMLException)obj));
        }
        else if(obj instanceof FlowException) {
            this.stack.add(new LogFlowExceptn((FlowException)obj));
        }
        else if(obj instanceof Exception) {
            this.stack.add(new LogExceptn((Exception)obj));
        }

    }


    /**
     * @description Add a log to the stack and immediately publish it, as well as any 
     *              other pending logs in the queue. If you are expecting to add multiple logs in rapid succession,
     *              the add(obj) and publish() methods should be used instead.
     * @param       obj An object to be parsed into a log message. 
     *                  Currently suported objects are `String`, `Exception`, `DMLException`
     *              To add support for additional objects, the Log.cls should be subclassed.
     */
    public void publish(Object obj) {
        this.publish(obj, LogSeverity.INFO);
    }

    /**
     * @description Add a log to the stack and immediately publish it, as well as any 
     *              other pending logs in the queue. If you are expecting to add multiple logs in rapid succession,
     *              the add(obj) and publish() methods should be used instead.
     * @param       obj An object to be parsed into a log message. 
     *                  Currently suported objects are `String`, `Exception`, `DMLException`
     *              To add support for additional objects, the Log.cls should be subclassed.
     * @param       severity LogSeverity enum
     */
    public void publish(Object obj, LogSeverity severity) {
        this.add(obj, severity);
        this.publish();
    }

    /**
     * @description Take all pending logs in the stack, and publish them to a `Log__e` platform event, 
     *              removing them from the stack.
     */
    public void publish() {

        List<SObject> logsToPublish = new List<SObject>(); // SObject to cater for other event types in future - perhaps not needed?
        
        for(Log log : this.stack) {
            logsToPublish.add(log.toEvent());
        }

        EventBus.publish(logsToPublish);
        this.stack.clear();

    }

}