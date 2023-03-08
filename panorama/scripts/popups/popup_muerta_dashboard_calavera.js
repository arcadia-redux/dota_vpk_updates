/// <reference path="../dota.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../dota_sequence_actions.ts" />
var flameRevealSeq;
var glowSeq;
var flameLoopingSeq;
var glowLoopingSeq;
const TRANSITION_INTERVAL = 0.02;
const INITIAL_DELAY = 0.2;
const LOOP_START = 45;
const ANIM_END = 134;
// Called from C++
var FlameReveal = function (panel_id) {
    let node = $('#' + panel_id);
    node.AddClass('Frame000');
    if (flameLoopingSeq) {
        flameLoopingSeq.finish();
    }
    if (flameRevealSeq) {
        flameRevealSeq.finish();
    }
    flameRevealSeq = new RunSequentialActions();
    flameRevealSeq.actions.push(new WaitAction(INITIAL_DELAY));
    let currentFrame = 1;
    while (currentFrame < LOOP_START) {
        flameRevealSeq.actions.push(new RemoveClassAction(node, 'Frame' + (currentFrame - 1).toString().padStart(3, '0')));
        flameRevealSeq.actions.push(new AddClassAction(node, 'Frame' + currentFrame.toString().padStart(3, '0')));
        flameRevealSeq.actions.push(new WaitAction(TRANSITION_INTERVAL));
        currentFrame++;
    }
    flameLoopingSeq = new RunLoopingActions();
    while (currentFrame <= ANIM_END) {
        flameLoopingSeq.actions.push(new RemoveClassAction(node, 'Frame' + (currentFrame - 1).toString().padStart(3, '0')));
        if (currentFrame <= ANIM_END) {
            flameLoopingSeq.actions.push(new AddClassAction(node, 'Frame' + currentFrame.toString().padStart(3, '0')));
        }
        flameLoopingSeq.actions.push(new WaitAction(TRANSITION_INTERVAL));
        if (currentFrame == ANIM_END) {
            flameLoopingSeq.actions.push(new RemoveClassAction(node, 'Frame' + ANIM_END.toString().padStart(3, '0')));
        }
        currentFrame++;
    }
    flameRevealSeq.actions.push(flameLoopingSeq);
    RunSingleAction(flameRevealSeq);
};
// Called from C++
var GlowReveal = function (panel_id) {
    let node = $('#' + panel_id);
    node.AddClass('Frame000');
    if (glowLoopingSeq) {
        glowLoopingSeq.finish();
    }
    if (glowSeq) {
        glowSeq.finish();
    }
    glowSeq = new RunSequentialActions();
    glowSeq.actions.push(new WaitAction(INITIAL_DELAY));
    let currentFrame = 1;
    while (currentFrame < LOOP_START) {
        glowSeq.actions.push(new RemoveClassAction(node, 'Frame' + (currentFrame - 1).toString().padStart(3, '0')));
        glowSeq.actions.push(new AddClassAction(node, 'Frame' + currentFrame.toString().padStart(3, '0')));
        glowSeq.actions.push(new WaitAction(TRANSITION_INTERVAL));
        currentFrame++;
    }
    glowLoopingSeq = new RunLoopingActions();
    while (currentFrame <= ANIM_END) {
        glowLoopingSeq.actions.push(new RemoveClassAction(node, 'Frame' + (currentFrame - 1).toString().padStart(3, '0')));
        if (currentFrame <= ANIM_END) {
            glowLoopingSeq.actions.push(new AddClassAction(node, 'Frame' + currentFrame.toString().padStart(3, '0')));
        }
        glowLoopingSeq.actions.push(new WaitAction(TRANSITION_INTERVAL));
        if (currentFrame == ANIM_END) {
            glowLoopingSeq.actions.push(new RemoveClassAction(node, 'Frame' + ANIM_END.toString().padStart(3, '0')));
        }
        currentFrame++;
    }
    glowSeq.actions.push(glowLoopingSeq);
    RunSingleAction(glowSeq);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXBfbXVlcnRhX2Rhc2hib2FyZF9jYWxhdmVyYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvcHVwX211ZXJ0YV9kYXNoYm9hcmRfY2FsYXZlcmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUNuQyxvREFBb0Q7QUFFcEQsSUFBSSxjQUFnRCxDQUFDO0FBQ3JELElBQUksT0FBeUMsQ0FBQztBQUM5QyxJQUFJLGVBQThDLENBQUM7QUFDbkQsSUFBSSxjQUE2QyxDQUFDO0FBRWxELE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQztBQUMxQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBRXJCLGtCQUFrQjtBQUNsQixJQUFJLFdBQVcsR0FBRyxVQUFVLFFBQWdCO0lBQ3hDLElBQUksSUFBSSxHQUFZLENBQUMsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUM7SUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUUxQixJQUFJLGVBQWUsRUFBRTtRQUNqQixlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDNUI7SUFFRCxJQUFJLGNBQWMsRUFBRTtRQUNoQixjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0I7SUFFRCxjQUFjLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0lBQzVDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFFM0QsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sWUFBWSxHQUFHLFVBQVUsRUFBRTtRQUM5QixjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBRUQsZUFBZSxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztJQUMxQyxPQUFPLFlBQVksSUFBSSxRQUFRLEVBQUU7UUFDN0IsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BILElBQUksWUFBWSxJQUFJLFFBQVEsRUFBRTtZQUMxQixlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5RztRQUNELGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLFlBQVksSUFBSSxRQUFRLEVBQUU7WUFDMUIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RztRQUNELFlBQVksRUFBRSxDQUFDO0tBQ2xCO0lBRUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFN0MsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQTtBQUVELGtCQUFrQjtBQUNsQixJQUFJLFVBQVUsR0FBRyxVQUFVLFFBQWdCO0lBQ3ZDLElBQUksSUFBSSxHQUFZLENBQUMsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUM7SUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUUxQixJQUFJLGNBQWMsRUFBRTtRQUNoQixjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0I7SUFFRCxJQUFJLE9BQU8sRUFBRTtRQUNULE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNwQjtJQUVELE9BQU8sR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7SUFDckMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUVwRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7SUFDckIsT0FBTyxZQUFZLEdBQUcsVUFBVSxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDMUQsWUFBWSxFQUFFLENBQUM7S0FDbEI7SUFFRCxjQUFjLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0lBQ3pDLE9BQU8sWUFBWSxJQUFJLFFBQVEsRUFBRTtRQUM3QixjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsSUFBSSxZQUFZLElBQUksUUFBUSxFQUFFO1lBQzFCLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdHO1FBQ0QsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksWUFBWSxJQUFJLFFBQVEsRUFBRTtZQUMxQixjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVHO1FBQ0QsWUFBWSxFQUFFLENBQUM7S0FDbEI7SUFFRCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUVyQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsQ0FBQyxDQUFBIn0=