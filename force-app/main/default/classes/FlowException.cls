/**
* @author elganellis 
* @description Custom exception for errors executed in flows.
*/

public with sharing class FlowException extends Exception {

    public String flowName;
    public String failingActionName;
/**
     * @description Constructor
     * @param faultMessage the fault message produced by the flow when the error was encountere
     * @param flowName the name of the flow that reported the error
     * @param failingActionName the name of the action that triggered the error
     */
    public FlowException(String faultMessage, String flowName, String failingActionName) {
        
        this(faultMessage,flowName);
        this.failingActionName = failingActionName;
        
    }
/**
     * @description Constructor
     * Used for creating flow exceptions without the name of the causing action 
     * @param faultMessage the fault message produced by the flow when the error was encountere
     * @param flowName the name of the flow that reported the error
    */
    public FlowException(String faultMessage, String flowName) {
        
        this.flowName = flowName;
        setMessage(faultMessage);
        
    }
}