
/**
* @author elganellis 
* @description class used to contain an invocable method 'log flow exceptions' to log errors in flows
*/
public with sharing class InvocableFlowExceptions {
    /**
     * @description Invocable input class
     * @param faultMessage the fault message produced by the flow when the error was encountere
     * @param flowName the name of the flow that reported the error
     * @param failingActionName the name of the action that triggered the error
     */
      public class MethodInput {

        @InvocableVariable(required=true)
        public String faultMessage;

        @InvocableVariable(required=true)
        public String flowName;

        @InvocableVariable(required=false)
        public String failing_action_name;

      }
    /**
     * @description invocable method that takes detail of a flow error and logs it as a log event record
     */
    @InvocableMethod( label = 'Log flow exception') 
    public static void LogExceptions(List<MethodInput> methodInputs) {
        
        Logger exceptionLogger = Logger.get();
        
        for (MethodInput input : methodInputs) {

            FlowException newFlowException = new FlowException( input.faultMessage,input.flowName, input.failing_action_name);
            exceptionLogger.add(newFlowException);
        
        }

        exceptionLogger.publish();
        

    }
}