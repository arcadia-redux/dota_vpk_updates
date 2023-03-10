/// <reference path="../../dota.d.ts" />
/// <reference path="../../util.ts" />
/// <reference path="../../dota_sequence_actions.ts" />
// For debugging, allow turning off the fade out
let g_bFadeOutEnabled = true;
function IsFadeOutEnabled() {
    return g_bFadeOutEnabled;
}
function SetFadeOutEnabled(bEnabled) {
    g_bFadeOutEnabled = bEnabled;
    const toggleButton = $('#ToggleFadeOut');
    if (toggleButton) {
        toggleButton.SetSelected(bEnabled);
    }
}
function ToggleFadeOutEnabled() {
    SetFadeOutEnabled(!IsFadeOutEnabled());
}
/** Wait for any hero models to finish async loading */
class WaitForHeroModelsAction extends WaitForConditionAction {
    constructor() {
        super(() => $.GetContextPanel().AreHeroModelsLoaded());
    }
}
/** Action to wait until a set of scene panels has loaded */
class WaitForScenesToLoadAction {
    constructor(...scenePanels) {
        this.scenePanels = scenePanels;
    }
    start() {
        // Setup a sequence to track the things that are loading
        this.loadingSeq = new RunSequentialActions();
        const par = new RunParallelActions();
        for (let i = 0; i < this.scenePanels.length; ++i) {
            par.actions.push(new WaitForClassAction(this.scenePanels[i], 'SceneLoaded'));
        }
        this.loadingSeq.actions.push(par);
        // Wait at least one frame before checking that hero models are loaded. This is to make
        // sure that the update that starts the spawning has a chance to run.
        this.loadingSeq.actions.push(new WaitOneFrameAction());
        this.loadingSeq.actions.push(new WaitForHeroModelsAction());
        // Setup a sequence to show loading state after a delay
        this.uiSeq = new RunSequentialActions();
        this.uiSeq.actions.push(new WaitAction(2.0));
        this.uiSeq.actions.push(new AddClassAction($.GetContextPanel(), 'LoadingVersusScreen'));
        // Start up both sequences
        this.loadingSeq.start();
        this.uiSeq.start();
    }
    update() {
        // Tick both sequences, but move on the minute the loading sequence is done
        this.uiSeq.update();
        return this.loadingSeq.update();
    }
    ;
    finish() {
        this.uiSeq.finish();
        this.loadingSeq.finish();
        $.GetContextPanel().RemoveClass('LoadingVersusScreen');
    }
    ;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG90YV9odWRfdmVyc3VzX3NjZW5lX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvdGFfaHVkX3ZlcnN1c19zY2VuZV9zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0Qyx1REFBdUQ7QUFFdkQsZ0RBQWdEO0FBQ2hELElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFNBQVMsZ0JBQWdCO0lBRXhCLE9BQU8saUJBQWlCLENBQUM7QUFDMUIsQ0FBQztBQUNELFNBQVMsaUJBQWlCLENBQUUsUUFBaUI7SUFFNUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDO0lBRTdCLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBeUIsZ0JBQWdCLENBQUUsQ0FBQztJQUNsRSxJQUFLLFlBQVksRUFDakI7UUFDQyxZQUFZLENBQUMsV0FBVyxDQUFFLFFBQVEsQ0FBRSxDQUFDO0tBQ3JDO0FBQ0YsQ0FBQztBQUNELFNBQVMsb0JBQW9CO0lBRTVCLGlCQUFpQixDQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBRSxDQUFDO0FBQzFDLENBQUM7QUFFRCx1REFBdUQ7QUFDdkQsTUFBTSx1QkFBd0IsU0FBUSxzQkFBc0I7SUFFM0Q7UUFFQyxLQUFLLENBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBd0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFFLENBQUM7SUFDaEYsQ0FBQztDQUNEO0FBRUQsNERBQTREO0FBQzVELE1BQU0seUJBQXlCO0lBTzlCLFlBQWEsR0FBRyxXQUFzQjtRQUVyQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNoQyxDQUFDO0lBRUQsS0FBSztRQUVKLHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUU3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDckMsS0FBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUNqRDtZQUNDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksa0JBQWtCLENBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUUsQ0FBRSxDQUFDO1NBQ2pGO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1FBRXBDLHVGQUF1RjtRQUN2RixxRUFBcUU7UUFDckUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksa0JBQWtCLEVBQUUsQ0FBRSxDQUFDO1FBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLHVCQUF1QixFQUFFLENBQUUsQ0FBQztRQUU5RCx1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksVUFBVSxDQUFFLEdBQUcsQ0FBRSxDQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksY0FBYyxDQUFFLENBQUMsQ0FBQyxlQUFlLEVBQXdCLEVBQUUscUJBQXFCLENBQUUsQ0FBRSxDQUFDO1FBRWxILDBCQUEwQjtRQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU07UUFFTCwyRUFBMkU7UUFDM0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUFBLENBQUM7SUFFRixNQUFNO1FBRUwsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxlQUFlLEVBQXdCLENBQUMsV0FBVyxDQUFFLHFCQUFxQixDQUFFLENBQUM7SUFDaEYsQ0FBQztJQUFBLENBQUM7Q0FDRiJ9